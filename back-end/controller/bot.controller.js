const botModel = require("../model/bot.model");
const botHistoryModel = require("../model/botHistory.model");

module.exports.getbots = async (req, res) => {
  try {
    const bots = await botModel
      .find()
      .populate({ path: "data.operator", select: "name email role" })
      .populate({ path: "operators.user", select: "-password" });
    if (bots) {
      res.status(200).json({ message: "bots found", bots: bots });
    } else {
      res.status(401).json({ message: "no bot found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.botsocket = (io, socket) => {
  const sendBotData = async (target) => {
    try {
      const bots = await botModel
        .find()
        .populate({ path: "data.operator", select: "name email role" })
        .populate({ path: "operators.user", select: "-password" });
      target.emit("botData", bots);
    } catch (error) {
      console.error("Error fetching bots:", error);
    }
  };
  const sendTodayBotdata = async (target) => {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const history = await botHistoryModel
        .find({ "data.date": { $gte: start } })
        .populate({ path: "data.operator", select: "name email role" })
        .populate({ path: "operators.user", select: "-password" });
      target.emit("todaysData", history);
    } catch (error) {
      console.error("Error fetching bots:", error);
    }
  };
  const dashboardStats = async (target) => {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const startToday = new Date();
      startToday.setHours(0, 0, 0, 0);
      const startYesterday = new Date();
      startYesterday.setDate(startYesterday.getDate() - 1);
      startYesterday.setHours(0, 0, 0, 0);
      const endYesterday = new Date(startToday);
      const startlastweek = new Date();
      startlastweek.setDate(startlastweek.getDate() - 7);
      startlastweek.setHours(0, 0, 0, 0);

      const lastweekHistory = await botHistoryModel.aggregate([
        {
          $match: {
            "data.date": { $gte: startlastweek },
          },
        },
        {
          $unwind: "$data",
        },
        {
          $match: {
            "data.date": { $gte: startlastweek },
          },
        },
        {
          $group: {
            _id: {
              day: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$data.date",
                },
              },
            },
            activeBots: {
              $sum: {
                $cond: [{ $eq: ["$data.Status", "cleaning"] }, 1, 0],
              },
            },
            operators: { $addToSet: "$data.operator" },
            avgBattery: { $avg: "$data.Battery" },
            avgDistance: { $avg: "$data.DistanceCovered" },
            avgHumidity: { $avg: "$data.humidity" },
            avgTemp: { $avg: "$data.temp" },
            avgWasteFull: {
              $avg: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$data.Wastetraystatus", "full"] },
                      then: 1,
                    },
                    {
                      case: { $eq: ["$data.Wastetraystatus", "empty"] },
                      then: 0,
                    },
                    {
                      case: { $eq: ["$data.Wastetraystatus", "half"] },
                      then: 0.5,
                    },
                  ],
                  default: 0,
                },
              },
            },
            alerts: {
              $sum: {
                $cond: [{ $lt: ["$data.Battery", 20] }, 1, 0],
              },
            },
            totalbots: { $addToSet: "$UniqueCode" },
          },
        },
      ]);

      const lastHourHistory = await botHistoryModel.find({
        "data.date": { $gte: oneHourAgo, $lte: now },
      });

      const todayHistory = await botHistoryModel.find({
        "data.date": { $gte: startToday },
      });

      const yesterdayHistory = await botHistoryModel.find({
        "data.date": { $gte: startYesterday, $lt: endYesterday },
      });
      const calculateStats = (bots) => {
        let activeBots = 0;
        let operators = new Set();
        let totalBattery = 0;
        let totalDistance = 0;
        let totalHumidity = 0;
        let totalTemp = 0;
        let alerts = 0;
        let wasteFull = 0;
        let totalbots = 0;
        console.log("todayHistory raw:", todayHistory[0]);

        bots.forEach((bot) => {
          bot.data?.forEach((d) => {
            if (d.Status?.toLowerCase() === "cleaning") {
              activeBots++;
            }

            totalBattery += d.battery || 0;

            if (d.battery < 20) {
              alerts++;
            }

            totalDistance += d.DistanceCovered || 0;

            totalHumidity += d.humidity || 0;

            totalTemp += d.temperature || 0;

            if (d.Wastetraystatus === "full") {
              wasteFull++;
            }
          });
          bot.operators?.forEach((o) => operators.add(o.user?._id));
          bot._id && totalbots++;
        });
        return {
          activeBots,
          operators: operators.size,
          avgBattery: totalbots ? Math.round(totalBattery / totalbots) : 0,
          avgDistance: totalbots ? Math.round(totalDistance / totalbots) : 0,
          avgHumidity: totalbots ? Math.round(totalHumidity / totalbots) : 0,
          avgTemp: totalbots ? Math.round(totalTemp / totalbots) : 0,
          avgWasteFull: totalbots
            ? Math.round((wasteFull / totalbots) * 100)
            : 0,
          alerts,
          totalbots,
        };
      };

      const todayStats = calculateStats(todayHistory);
      const yesterdayStats = calculateStats(yesterdayHistory);

      const change = {
        activeBots: todayStats.activeBots - yesterdayStats.activeBots,
        operators: todayStats.operators - yesterdayStats.operators,
        avgBattery: todayStats.avgBattery - yesterdayStats.avgBattery,
        avgDistance: todayStats.avgDistance - yesterdayStats.avgDistance,
        avgHumidity: todayStats.avgHumidity - yesterdayStats.avgHumidity,
        avgTemp: todayStats.avgTemp - yesterdayStats.avgTemp,
        avgWasteFull: todayStats.avgWasteFull - yesterdayStats.avgWasteFull,
        alerts: todayStats.alerts - yesterdayStats.alerts,
        totalbots: todayStats.totalbots - yesterdayStats.totalbots,
      };

      target.emit("dashboardStats", {
        lastHour: lastHourHistory,
        today: todayStats,
        yesterday: yesterdayStats,
        change,
        lastweek: lastweekHistory,
      });
    } catch (error) {
      console.error("Error fetching bots:", error);
    }
  };
  sendBotData(socket);
  sendTodayBotdata(socket);
  dashboardStats(socket);
  botModel.watch().on("change", async () => {
    console.log("Bot data Changed");
    sendBotData(io);
    sendTodayBotdata(io);
    dashboardStats(io);
  });
  botHistoryModel.watch().on("change", async () => {
    console.log("Bot History Changed");
    sendBotData(io);
    sendTodayBotdata(io);
    dashboardStats(io);
  });
  socket.on("initDashboard", async () => {
    sendBotData(socket);
    sendTodayBotdata(socket);
    dashboardStats(socket);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
};

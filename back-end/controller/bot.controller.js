const botModel = require("../model/bot.model");
const botHistoryModel = require("../model/botHistory.model");

module.exports.getbots = async (req, res) => {
  try {
    const bots = await botModel
      .find()
      .populate({ path: "data.operator", select: "name email role" })
      .populate({ path: "operators.user", select: "-password" });
    if (bots.length > 0) {
      res.status(200).json({ message: "bots found", bots: bots });
    } else {
      res.status(401).json({ message: "no bot found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getBotAnalysis = async (req, res) => {
  try {
    const botAnalysis = await botHistoryModel.aggregate([
      {
        $unwind: "$data",
      },
      {
        $match: {
          $expr: {
            $gte: [
              "$data.date",
              {
                $dateSubtract: {
                  startDate: "$$NOW",
                  unit: "day",
                  amount: 30,
                },
              },
            ],
          },
        },
      },
      {
        $sort: {
          "data.date": -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "data.operator",
          foreignField: "_id",
          as: "operatorDetails",
        },
      },
      {
        $unwind: {
          path: "$operatorDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            time: {
              $dateTrunc: {
                date: "$data.date",
                unit: "minute",
                binSize: 15,
              },
            },
          },
          data: { $first: "$data" },
          UniqueCode: { $first: "$UniqueCode" },
          botName: { $first: "$name" },
          operator: { $first: "$operatorDetails" },
        },
      },
      {
        $project: {
          _id: 0,
          time: "$_id.time",
          UniqueCode: 1,
          botName: 1,
          Status: "$data.Status",

          operatorName: "$operator.name",
          operatorEmail: "$operator.email",
          operatorRole: "$operator.role",

          Battery: "$data.Battery",
          temperature: "$data.temperature",
          humidity: "$data.humidity",

          location: "$data.position.city",
        },
      },
      { $sort: { time: -1 } },
    ]);
    if (botAnalysis.length > 0) {
      res.status(200).json({ message: "bots found", bots: botAnalysis });
    } else {
      res.status(401).json({ message: "no bot found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.botsocket = (io, socket) => {
  let intervalId;
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
  const dashboardStats = async (target) => {
    try {
      const last30Min = new Date(Date.now() - 30 * 60 * 1000);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const yesterdayStart = new Date();
      yesterdayStart.setDate(todayStart.getDate() - 1);
      yesterdayStart.setHours(0, 0, 0, 0);
      const totalBotsCount = await botModel.countDocuments();
      const stats = await botHistoryModel.aggregate([
        { $unwind: "$data" },
        {
          $facet: {
            lastweekHistory: [
              {
                $match: {
                  $expr: {
                    $gte: [
                      "$data.date",
                      {
                        $dateSubtract: {
                          startDate: "$$NOW",
                          unit: "day",
                          amount: 7,
                        },
                      },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: {
                    day: {
                      $dateToString: { format: "%Y-%m-%d", date: "$data.date" },
                    },
                  },
                  activeBotSet: {
                    $addToSet: {
                      $cond: [
                        { $eq: ["$data.Status", "cleaning"] },
                        "$data.UniqueCode",
                        null,
                      ],
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
                    $sum: { $cond: [{ $lt: ["$data.Battery", 20] }, 1, 0] },
                  },
                  totalbots: { $addToSet: "$UniqueCode" },
                },
              },
              {
                $project: {
                  activeBots: {
                    $size: {
                      $filter: {
                        input: "$activeBotSet",
                        as: "bot",
                        cond: { $ne: ["$$bot", null] },
                      },
                    },
                  },
                  operators: 1,
                  avgBattery: 1,
                  avgDistance: 1,
                  avgHumidity: 1,
                  avgTemp: 1,
                  alerts: 1,
                },
              },
              { $sort: { "_id.day": 1 } },
            ],
            halfHourHistory: [
              {
                $match: {
                  $expr: { $gte: ["$data.date", last30Min] },
                },
              },

              {
                $group: {
                  _id: "$UniqueCode",
                  avgBattery: { $avg: "$data.Battery" },
                  avgDistance: { $avg: "$data.DistanceCovered" },
                  avgTemp: { $avg: "$data.temp" },
                  avgHumidity: { $avg: "$data.humidity" },

                  wasteTray: {
                    $avg: {
                      $switch: {
                        branches: [
                          {
                            case: { $eq: ["$data.Wastetraystatus", "full"] },
                            then: 100,
                          },
                          {
                            case: { $eq: ["$data.Wastetraystatus", "half"] },
                            then: 50,
                          },
                        ],
                        default: 0,
                      },
                    },
                  },

                  status: { $last: { $toLower: "$data.Status" } },
                },
              },

              {
                $project: {
                  _id: 0,
                  bot: "$_id",
                  avgBattery: { $round: ["$avgBattery", 2] },
                  avgDistance: { $round: ["$avgDistance", 2] },
                  avgTemp: { $round: ["$avgTemp", 2] },
                  avgHumidity: { $round: ["$avgHumidity", 2] },
                  wasteTray: { $round: ["$wasteTray", 0] },
                  status: 1,
                },
              },

              { $sort: { bot: 1 } },
            ],
            todayTimeline: [
              {
                $match: {
                  $expr: { $gte: ["$data.date", todayStart] },
                },
              },
              {
                $group: {
                  _id: {
                    time: {
                      $dateTrunc: {
                        date: "$data.date",
                        unit: "minute",
                        binSize: 30,
                      },
                    },
                  },

                  avgBattery: { $avg: "$data.Battery" },
                  avgTemp: { $avg: "$data.temp" },
                  avgHumidity: { $avg: "$data.humidity" },
                },
              },

              {
                $project: {
                  _id: 0,
                  time: "$_id.time",
                  avgBattery: { $round: ["$avgBattery", 2] },
                  avgTemp: { $round: ["$avgTemp", 2] },
                  avgHumidity: { $round: ["$avgHumidity", 2] },
                },
              },

              { $sort: { time: 1 } },
            ],
            botTimeline: [
              {
                $match: {
                  $expr: { $gte: ["$data.date", todayStart] },
                },
              },
              {
                $group: {
                  _id: {
                    bot: "$data.UniqueCode",
                    time: {
                      $dateTrunc: {
                        date: "$data.date",
                        unit: "minute",
                        binSize: 30,
                      },
                    },
                  },

                  avgBattery: { $avg: "$data.Battery" },
                  avgTemp: { $avg: "$data.temp" },
                  avgHumidity: { $avg: "$data.humidity" },
                  avgDistance: { $avg: "$data.DistanceCovered" },
                },
              },

              {
                $project: {
                  _id: 0,
                  bot: "$_id.bot",
                  time: "$_id.time",
                  avgBattery: { $round: ["$avgBattery", 2] },
                  avgTemp: { $round: ["$avgTemp", 2] },
                  avgHumidity: { $round: ["$avgHumidity", 2] },
                  avgDistance: { $round: ["$avgDistance", 2] },
                },
              },

              {
                $sort: {
                  bot: 1,
                  time: 1,
                },
              },
            ],
            todayStatsAgg: [
              {
                $match: {
                  $expr: { $gte: ["$data.date", todayStart] },
                },
              },
              {
                $group: {
                  _id: "$data.UniqueCode",

                  isActive: {
                    $max: {
                      $cond: [
                        { $eq: [{ $toLower: "$data.Status" }, "cleaning"] },
                        1,
                        0,
                      ],
                    },
                  },
                  operators: { $addToSet: "$data.operator" },
                  avgWasteFull: {
                    $avg: {
                      $switch: {
                        branches: [
                          {
                            case: { $eq: ["$data.Wastetraystatus", "full"] },
                            then: 1,
                          },
                          {
                            case: { $eq: ["$data.Wastetraystatus", "half"] },
                            then: 0.5,
                          },
                          {
                            case: { $eq: ["$data.Wastetraystatus", "empty"] },
                            then: 0,
                          },
                        ],
                        default: 0,
                      },
                    },
                  },
                  avgBattery: { $avg: "$data.Battery" },
                  avgDistance: { $avg: "$data.DistanceCovered" },
                  avgHumidity: { $avg: "$data.humidity" },
                  avgTemp: { $avg: "$data.temp" },

                  alerts: {
                    $sum: {
                      $cond: [{ $lt: ["$data.Battery", 20] }, 1, 0],
                    },
                  },
                },
              },

              {
                $group: {
                  _id: null,
                  activeBots: { $sum: "$isActive" },
                  totalbots: { $sum: 1 },
                  avgBattery: { $avg: "$avgBattery" },
                  avgDistance: { $avg: "$avgDistance" },
                  avgHumidity: { $avg: "$avgHumidity" },
                  avgTemp: { $avg: "$avgTemp" },
                  operators: { $sum: { $size: "$operators" } },
                  avgWasteFull: { $avg: "$avgWasteFull" },
                  alerts: { $sum: "$alerts" },
                },
              },

              { $project: { _id: 0 } },
            ],
            yesterdayStatsAgg: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $gte: ["$data.date", yesterdayStart] },
                      { $lt: ["$data.date", todayStart] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$data.UniqueCode",

                  isActive: {
                    $max: {
                      $cond: [
                        { $eq: [{ $toLower: "$data.Status" }, "cleaning"] },
                        1,
                        0,
                      ],
                    },
                  },
                  operators: { $addToSet: "$data.operator" },
                  avgWasteFull: {
                    $avg: {
                      $switch: {
                        branches: [
                          {
                            case: { $eq: ["$data.Wastetraystatus", "full"] },
                            then: 1,
                          },
                          {
                            case: { $eq: ["$data.Wastetraystatus", "half"] },
                            then: 0.5,
                          },
                          {
                            case: { $eq: ["$data.Wastetraystatus", "empty"] },
                            then: 0,
                          },
                        ],
                        default: 0,
                      },
                    },
                  },

                  avgBattery: { $avg: "$data.Battery" },
                  avgDistance: { $avg: "$data.DistanceCovered" },
                  avgHumidity: { $avg: "$data.humidity" },
                  avgTemp: { $avg: "$data.temp" },

                  alerts: {
                    $sum: {
                      $cond: [{ $lt: ["$data.Battery", 20] }, 1, 0],
                    },
                  },
                },
              },

              {
                $group: {
                  _id: null,
                  activeBots: { $sum: "$isActive" },
                  totalbots: { $sum: 1 },
                  avgBattery: { $avg: "$avgBattery" },
                  avgDistance: { $avg: "$avgDistance" },
                  avgHumidity: { $avg: "$avgHumidity" },
                  avgTemp: { $avg: "$avgTemp" },
                  operators: { $sum: { $size: "$operators" } },
                  avgWasteFull: { $avg: "$avgWasteFull" },
                  alerts: { $sum: "$alerts" },
                },
              },

              { $project: { _id: 0 } },
            ],
          },
        },
      ]);

      const result = stats[0] || {};
      const todayStats = result.todayStatsAgg?.[0] || {};
      const yesterdayStats = result.yesterdayStatsAgg?.[0] || {};
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
      console.log(result.lastMonthHistory[0]);
      target.emit("dashboardStats", {
        lastweekHistory: result.lastweekHistory || [],
        halfHourHistory: result.halfHourHistory || [],
        change: change,
        totalBotsCount: totalBotsCount,
        todayBotData: result.botTimeline || [],
        todayStats: result.todayStatsAgg?.[0] || {},
      });
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };
  sendBotData(socket);
  dashboardStats(socket);
  botModel.watch().on("change", async () => {
    console.log("Bot data Changed");
    sendBotData(io);
  });
  socket.on("initDashboard", async () => {
    sendBotData(socket);
    dashboardStats(socket);
  });
  if (!intervalId) {
    intervalId = setInterval(
      () => {
        dashboardStats(io);
      },
      30 * 60 * 1000,
    );
  }
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });
};

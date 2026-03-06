// import { useBotData } from "@/context/BotContext";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
const dummyhalfHourHistory = [
  {
    bot: "1123",
    status: "cleaning",
    avgBattery: 78,
    avgDistance: 8345.92,
    avgTemp: 32,
    avgHumidity: 79,
    wasteTray: 50,
  },
  {
    bot: "1124",
    status: "cleaning",
    avgBattery: 72,
    avgDistance: 8358.29,
    avgTemp: 31,
    avgHumidity: 76,
    wasteTray: 45,
  },
  {
    bot: "1125",
    status: "cleaning",
    avgBattery: 69,
    avgDistance: 8425.03,
    avgTemp: 28,
    avgHumidity: 74,
    wasteTray: 52,
  },
  {
    bot: "1126",
    status: "cleaning",
    avgBattery: 65,
    avgDistance: 8798.08,
    avgTemp: 28,
    avgHumidity: 72,
    wasteTray: 48,
  },
  {
    bot: "1127",
    status: "cleaning",
    avgBattery: 61,
    avgDistance: 8796.46,
    avgTemp: 30,
    avgHumidity: 75,
    wasteTray: 55,
  },
];
const Barchart = () => {
  // const { dashboardStats } = useBotData();
  const wasteData = useMemo(() => {
    // if (!dashboardStats?.halfHourHistory) return [];
    if (!dummyhalfHourHistory) return [];

    return dummyhalfHourHistory.map((bot) => ({
      name: bot.bot,
      wasteTray: bot.wasteTray,
    }));
    // return dashboardStats.halfHourHistory.map((bot) => ({
    //   name: bot.bot,
    //   wasteTray: bot.wasteTray,
    // }));
    // }, [dashboardStats]);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md w-full h-[350px] flex flex-col">
      <div className="p-4 border-b">
        <h4 className="text-lg font-semibold text-gray-900">Waste Tray</h4>
      </div>
      <div className="p-3">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={wasteData}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              // interval={0}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              // domain={[0, 100]}
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value) => `${value}%`}
              labelFormatter={(label, payload) => {
                if (payload && payload.length) {
                  return payload[0].payload.fullDate;
                }
                return label;
              }}
              cursor={{ fill: "rgba(238, 238, 238, 0.5)" }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                border: "1px solid #ccc",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Bar
              type={"monotone"}
              dataKey="wasteTray"
              name="Waste Tray %"
              fill="url(#colorGradient)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Barchart;

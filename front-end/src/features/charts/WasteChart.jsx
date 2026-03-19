// import { useBotData } from "@/context/BotContext";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
const lastweekHistory = [
  {
    _id: { day: "2026-03-01" },
    activeBots: 2,
    alerts: 4120,
    avgBattery: 62.5,
    avgDistance: 6200.45,
    avgHumidity: 78.4,
    avgTemp: 28.2,
    avgWasteFull: 0.45,
    operators: [
      "684ed8b2f8a8bf79bf0e4595",
      "68317531db31434570f3d067",
      "6888f3213651eedf2d796391",
      "68820908d984f13a82d34868",
      "68355f014e6577b52aaa7066",
    ],
    totalbots: ["1123", "1124", "1125", "1126", "1127"],
  },

  {
    _id: { day: "2026-03-02" },
    activeBots: 3,
    alerts: 5301,
    avgBattery: 55.2,
    avgDistance: 7120.21,
    avgHumidity: 81.7,
    avgTemp: 29.1,
    avgWasteFull: 0.52,
    operators: [
      "684ed8b2f8a8bf79bf0e4595",
      "68317531db31434570f3d067",
      "6888f3213651eedf2d796391",
    ],
    totalbots: ["1123", "1124", "1125", "1126", "1127"],
  },

  {
    _id: { day: "2026-03-03" },
    activeBots: 0,
    alerts: 6239,
    avgBattery: -35.7144816928157,
    avgDistance: 8544.776570659285,
    avgHumidity: 83.74021239499129,
    avgTemp: 29.607069266127755,
    avgWasteFull: 0.5,
    operators: [
      "684ed8b2f8a8bf79bf0e4595",
      "68317531db31434570f3d067",
      "6888f3213651eedf2d796391",
      "68820908d984f13a82d34868",
      "68355f014e6577b52aaa7066",
    ],
    totalbots: ["1123", "1126", "1127", "1124", "1125"],
  },

  {
    _id: { day: "2026-03-04" },
    activeBots: 4,
    alerts: 4890,
    avgBattery: 70.8,
    avgDistance: 9012.11,
    avgHumidity: 80.2,
    avgTemp: 30.3,
    avgWasteFull: 0.61,
    operators: ["684ed8b2f8a8bf79bf0e4595", "68317531db31434570f3d067"],
    totalbots: ["1123", "1124", "1125", "1126", "1127"],
  },

  {
    _id: { day: "2026-03-05" },
    activeBots: 5,
    alerts: 3712,
    avgBattery: 82.6,
    avgDistance: 6501.44,
    avgHumidity: 76.5,
    avgTemp: 27.9,
    avgWasteFull: 0.39,
    operators: [
      "684ed8b2f8a8bf79bf0e4595",
      "68317531db31434570f3d067",
      "6888f3213651eedf2d796391",
      "68820908d984f13a82d34868",
    ],
    totalbots: ["1123", "1124", "1125", "1126", "1127"],
  },
];
const GradientBarChart = () => {
  // const { dashboardStats } = useBotData();
  const data = useMemo(() => {
    // if (!dashboardStats?.lastweekHistory) return [];
    if (!lastweekHistory) return [];
    // return dashboardStats.lastweekHistory.map((item) => {
    return lastweekHistory.map((item) => {
      const dateObj = new Date(item._id.day);
      return {
        day: dateObj.getDate(),
        fullDate: dateObj.toLocaleDateString("en-In", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        waste: Math.round((item.avgWasteFull || 0) * 100),
      };
    });
    // }, [dashboardStats]);
  }, []);
  return (
    <div className="bg-white rounded-xl shadow-md max-h-[400px]">
      <div className="p-6 border-b">
        <h4 className=" text-sm md:text-md lg:text-lg font-semibold text-gray-900">
          Waste Tray (last 7 days)
        </h4>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
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
              dataKey="day"
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
              dataKey="waste"
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

export default GradientBarChart;

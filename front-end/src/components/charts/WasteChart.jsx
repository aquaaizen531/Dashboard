import { useBotData } from "@/context/BotContext";
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

const GradientBarChart = () => {
  const { dashboardStats } = useBotData();
  console.log("dashboardStats:", dashboardStats);
  const data = useMemo(() => {
    if (!dashboardStats?.lastweekHistory) return [];
    return dashboardStats.lastweekHistory.map((item) => {
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
  }, [dashboardStats]);
  return (
    <div className="bg-white rounded-xl shadow-md max-h-[400px]">
      <div className="p-6 border-b">
        <h4 className="text-lg font-semibold text-gray-900">
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

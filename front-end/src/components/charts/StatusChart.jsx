import React, { useMemo } from "react";
import { useBotData } from "../../context/BotContext";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

const StatusChart = () => {
  const { botData } = useBotData();
  const data = useMemo(() => {
    if (!botData) return [];
    let formatedData = [
      { name: "charging", value: 0 },
      { name: "idle", value: 0 },
      { name: "active", value: 0 },
    ];
    botData.forEach((bot) => {
      bot.data.forEach((data) => {
        if (data.Status === "Charging") {
          formatedData[0].value += 1;
        } else if (data.Status === "Idle") {
          formatedData[1].value += 1;
        } else {
          formatedData[2].value += 1;
        }
      });
    });
    return formatedData;
  }, [botData]);
  const COLORS = ["#3b82f6", "#facc15", "#22c55e"];
  return (
    <div>
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusChart;

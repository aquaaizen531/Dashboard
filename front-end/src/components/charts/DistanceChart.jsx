import React, { useMemo } from "react";
import { useBotData } from "../../context/BotContext";
import {
  Line,
  Legend,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DistanceChart = () => {
  const { botData } = useBotData();
  const data = useMemo(() => {
    if (!botData) return [];
    const formatedData = botData.flatMap((bot) =>
      bot.data.map((data) => ({
        time: new Date(data.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        distanceCovered: data.DistanceCovered,
      })),
    );
    return formatedData;
  }, [botData]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          width="100%"
          height="100%"
          data={data}
          margin={{ right: 40, top: 20 }}
        >
          <XAxis dataKey="time" />
          <YAxis
            dataKey="distanceCovered"
            label={{ value: "Distance Covered (m)", angle: -90, dx: -20 }}
          />
          <CartesianGrid strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="distanceCovered"
            name="Distance Covered"
            fill="#3b82f6"
            stroke="#10b981"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistanceChart;

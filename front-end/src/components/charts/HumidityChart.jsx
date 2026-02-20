import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useBotData } from "../../context/BotContext";

const HumidityChart = () => {
  const { botData } = useBotData();
  const humidityData = useMemo(() => {
    if (!botData) return [];
    const formatedData = botData.flatMap((bot) =>
      bot.data.map((data) => ({
        time: new Date(data.date).toLocaleTimeString([], {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
        }),
        humidity: data.humidity,
      })),
    );
    return formatedData;
  }, [botData]);

  return (
    <div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={humidityData}
          // width={300}
          // height={400}
          margin={{ right: 40, top: 20 }}
        >
          <XAxis dataKey="time" />
          <YAxis />
          <CartesianGrid strokeDasharray="5 5" />
          <Legend />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="humidity"
            fill="#3b82f6"
            stroke="#2563eb"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HumidityChart;

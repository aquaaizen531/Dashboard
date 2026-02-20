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

const BatteryTempChart = () => {
  const { botData } = useBotData();
  const data = useMemo(() => {
    if (!botData) return [];
    const formatedData = botData.flatMap((bot) =>
      bot.data.map((entry) => ({
        time: new Date(entry.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        battery: Math.floor(entry.Battery),
        humidity: parseFloat(entry.humidity),
        temperature: entry.temp,
      })),
    );
    return formatedData;
  }, [botData]);
  return (
    <div className="flex-1">
      <ResponsiveContainer height={350}>
        <AreaChart
          width="100%"
          height="100%"
          data={data}
          margin={{ right: 30, top: 20, bottom: 20 }}
        >
          <XAxis dataKey="time" />
          <YAxis
            yAxisId="left"
            label={{ value: "Battery %", angle: -90, dx: -19 }}
            domain={[0, 100]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "Temp °C", angle: -90, dx: 10 }}
          />
          <CartesianGrid strokeDasharray="5 5" />
          <Tooltip />
          <Legend />

          <Area
            type={"monotone"}
            yAxisId="right"
            dataKey="temperature"
            name="Temperature"
            // dot={false}
            fill="#ef4444"
            stroke="#2563eb"
            stackId="1"
            fillOpacity={0.6}
          />
          <Area
            type={"monotone"}
            yAxisId="left"
            dataKey="battery"
            name="Battery"
            // dot={false}
            fill="#3b82f6"
            stroke="#735380"
            stackId="1"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
// const CUstomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
//         <p className="font-medium">{label}</p>
//         {payload.map((entry, index) => (
//           <p key={index} className="text-sm" style={{ color: entry.color }}>
//             {entry.name}: <span className="ml-2">{entry.value}</span>
//           </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };
export default BatteryTempChart;

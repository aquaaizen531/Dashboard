import React, { useMemo } from "react";
import { Area, AreaChart, XAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// import { useBotData } from "../../context/BotContext";

const chartConfig = {
  time: {
    label: "time",
    color: "#8884d8",
  },
  battery: {
    label: "battery",
    color: "#8884d8",
  },
};

const dummytodayBotData = [
  {
    time: "2026-03-06T10:00:00.000Z",
    bots: [
      { bot: "1123", battery: 51, distance: 8410, humidity: 81, temp: 29 },
      { bot: "1124", battery: 55, distance: 8390, humidity: 83, temp: 30 },
      { bot: "1125", battery: 47, distance: 8370, humidity: 80, temp: 28 },
      { bot: "1126", battery: 49, distance: 8405, humidity: 82, temp: 29 },
      { bot: "1127", battery: 53, distance: 8388, humidity: 84, temp: 30 },
    ],
  },
  {
    time: "2026-03-06T10:30:00.000Z",
    bots: [
      { bot: "1123", battery: 46, distance: 8452, humidity: 82, temp: 30 },
      { bot: "1124", battery: 52, distance: 8428, humidity: 81, temp: 29 },
      { bot: "1125", battery: 44, distance: 8410, humidity: 82, temp: 29 },
      { bot: "1126", battery: 43, distance: 8440, humidity: 83, temp: 30 },
      { bot: "1127", battery: 48, distance: 8425, humidity: 83, temp: 29 },
    ],
  },
  {
    time: "2026-03-06T11:00:00.000Z",
    bots: [
      { bot: "1123", battery: 41, distance: 8486, humidity: 83, temp: 29 },
      { bot: "1124", battery: 47, distance: 8461, humidity: 82, temp: 30 },
      { bot: "1125", battery: 39, distance: 8448, humidity: 84, temp: 30 },
      { bot: "1126", battery: 37, distance: 8472, humidity: 83, temp: 29 },
      { bot: "1127", battery: 43, distance: 8457, humidity: 82, temp: 29 },
    ],
  },
  {
    time: "2026-03-06T11:30:00.000Z",
    bots: [
      { bot: "1123", battery: 36, distance: 8525, humidity: 84, temp: 30 },
      { bot: "1124", battery: 42, distance: 8496, humidity: 82, temp: 30 },
      { bot: "1125", battery: 34, distance: 8482, humidity: 81, temp: 29 },
      { bot: "1126", battery: 33, distance: 8508, humidity: 82, temp: 30 },
      { bot: "1127", battery: 38, distance: 8493, humidity: 84, temp: 30 },
    ],
  },
  {
    time: "2026-03-06T12:00:00.000Z",
    bots: [
      { bot: "1123", battery: 29, distance: 8560, humidity: 83, temp: 30 },
      { bot: "1124", battery: 36, distance: 8525, humidity: 81, temp: 29 },
      { bot: "1125", battery: 31, distance: 8510, humidity: 82, temp: 30 },
      { bot: "1126", battery: 28, distance: 8545, humidity: 81, temp: 29 },
      { bot: "1127", battery: 33, distance: 8530, humidity: 83, temp: 30 },
    ],
  },
  {
    time: "2026-03-06T12:30:00.000Z",
    bots: [
      { bot: "1123", battery: 34, distance: 8580, humidity: 82, temp: 29 },
      { bot: "1124", battery: 40, distance: 8547, humidity: 83, temp: 29 },
      { bot: "1125", battery: 35, distance: 8532, humidity: 82, temp: 29 },
      { bot: "1126", battery: 33, distance: 8563, humidity: 83, temp: 29 },
      { bot: "1127", battery: 37, distance: 8548, humidity: 82, temp: 29 },
    ],
  },
  {
    time: "2026-03-06T13:00:00.000Z",
    bots: [
      { bot: "1123", battery: 41, distance: 8602, humidity: 81, temp: 28 },
      { bot: "1124", battery: 44, distance: 8570, humidity: 82, temp: 29 },
      { bot: "1125", battery: 39, distance: 8550, humidity: 81, temp: 28 },
      { bot: "1126", battery: 38, distance: 8584, humidity: 82, temp: 29 },
      { bot: "1127", battery: 42, distance: 8568, humidity: 81, temp: 28 },
    ],
  },
];
const botColors = ["#8884d8", "#82ca9d", "#ff7300", "#ff4d6d", "#00c2ff"];
const BatteryChart = () => {
  const { chartData, botId } = useMemo(() => {
    if (!dummytodayBotData) return { chartData: [], botIds: [] };
    const botId = dummytodayBotData[0].bots.map((b) => b.bot);
    const chartData = dummytodayBotData.map((entry) => {
      const dateObj = new Date(entry.time);
      const row = {
        time: dateObj.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
      entry.bots.forEach((b) => {
        row[b.bot] = b.battery;
      });
      return row;
    });
    return { chartData, botId };
  }, []);
  return (
    <div className="flex-1">
      <Card>
        <CardHeader>
          <CardTitle>Battery</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [` ${name}`, ` : ${value}%`]}
                  />
                }
              />
              <defs>
                <linearGradient id="fillBattery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              {botId.map((botId, idx) => (
                <Area
                  key={botId}
                  dataKey={botId}
                  name={`Bot ${botId}`}
                  type="natural"
                  stroke={botColors[idx % botColors.length]}
                  fill="none"
                  fillOpacity={0.2}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatteryChart;

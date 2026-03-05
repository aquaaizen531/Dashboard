import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  XAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useBotData } from "../../context/BotContext";

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

const BatteryChart = () => {
  const { dashboardStats } = useBotData();
  const data = useMemo(() => {
    if (!dashboardStats?.todayBotData) return [];
    return dashboardStats.todayBotData.map((bot) => {
      const dateObj = new Date(bot.time);
      return {
        time: dateObj.toLocaleTimeString("en-In", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        battery: bot.avgBattery,
      };
    });
  }, [dashboardStats]);
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
              data={data}
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
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillBattery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                dataKey="battery"
                type="natural"
                fill="url(#fillBattery)"
                fillOpacity={0.4}
                stroke="#8884d8"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatteryChart;

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
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartConfig = {
  time: {
    label: "time",
    color: "#8884d8",
  },
  distance: {
    label: "distance",
    color: "#8884d8",
  },
};
const DistanceChart = () => {
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
        distance: Math.round(bot.avgDistance),
      };
    });
  }, [dashboardStats]);

  return (
    <Card className="h-[350px] w-full">
      <CardHeader>
        <CardTitle>Average Distance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
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
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="distance"
              type="natural"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{
                fill: "#8884d8",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DistanceChart;

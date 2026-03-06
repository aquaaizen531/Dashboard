import React, { useMemo } from "react";
// import { useBotData } from "../../context/BotContext";
import { Pie, PieChart, Label } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  bots: {
    label: "bots",
  },
  active: {
    label: "active",
    color: "#4B4B4B",
  },
  idle: {
    label: "idle",
    color: "#808080",
  },
  charging: {
    label: "charging",
    color: "#B3B3B3",
  },
};
const dummyBots = [
  { botId: "BOT-1123", status: "active" },
  { botId: "BOT-1124", status: "charging" },
  { botId: "BOT-1125", status: "idle" },
  { botId: "BOT-1126", status: "active" },
  { botId: "BOT-1127", status: "charging" },
  { botId: "BOT-1128", status: "active" },
  { botId: "BOT-1129", status: "idle" },
];
const StatusChart = () => {
  // const { dashboardStats } = useBotData();
  // const data = useMemo(() => {
  //   if (!dashboardStats)
  //     return [
  //       { name: "charging", value: 0, fill: "#3b82f6" },
  //       { name: "idle", value: 0, fill: "#facc15" },
  //       { name: "active", value: 0, fill: "#22c55e" },
  //     ];
  //   let formatedData = [
  //     { name: "charging", value: 0, fill: "#3b82f6" },
  //     { name: "idle", value: 0, fill: "#facc15" },
  //     { name: "active", value: 0, fill: "#22c55e" },
  //   ];
  //   dashboardStats?.halfHourHistory?.forEach((bot) => {
  //     const status = bot?.status?.toLowerCase();
  //     if (status === "charging") {
  //       formatedData[0].value += 1;
  //     } else if (bot.status.toLowerCase() === "idle") {
  //       formatedData[1].value += 1;
  //     } else {
  //       formatedData[2].value += 1;
  //     }
  //   });
  //   return formatedData;
  // }, [dashboardStats]);
  // const totalBots = React.useMemo(() => {
  //   return data.reduce((acc, curr) => acc + curr.value, 0);
  // }, [data]);
  const data = useMemo(() => {
    let formatedData = [
      { name: "charging", value: 0, fill: "#3b82f6" },
      { name: "idle", value: 0, fill: "#facc15" },
      { name: "active", value: 0, fill: "#22c55e" },
    ];
    dummyBots.forEach((bot) => {
      const status = bot.status.toLowerCase();

      if (status === "charging") {
        formatedData[0].value += 1;
      } else if (status === "idle") {
        formatedData[1].value += 1;
      } else {
        formatedData[2].value += 1;
      }
    });

    return formatedData;
  }, []);
  return (
    <Card className="p-0 pb-3">
      <div className="p-4 border-b">
        <h4 className="text-lg font-semibold text-gray-900">Bot Status</h4>
      </div>
      <div className="flex items-center">
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart className="flex">
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {/* {totalBots.toLocaleString()} */}
                            5
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Bots
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <div className="flex-1 space-y-2 mt-6">
          {data.map((bot, index) => (
            <div key={index} className="flex items-center gap-4 text-md">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: bot.fill }}
                />
                <span className="text-xs">{bot.name}</span>
              </div>
              <span className="font-medium">{bot.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default StatusChart;

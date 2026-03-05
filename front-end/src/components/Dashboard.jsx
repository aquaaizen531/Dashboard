import React, { useEffect, useState } from "react";
import loginbg from "@/assets/bg/login_cover.png";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatCard from "./stat-card";
import {
  BatteryCharging,
  Bot,
  Droplets,
  MapPinned,
  Siren,
  Thermometer,
  Wrench,
} from "lucide-react";
import { useBotData } from "@/context/BotContext";
import GradientBarChart from "./charts/WasteChart";

const Dashboard = () => {
  const { dashboardStats } = useBotData();
  const [todayData, settodayData] = useState({});
  const [changeData, setChangeData] = useState({});
  const [totalBots, setTotalBots] = useState(0);

  console.log("dashboardStats:", dashboardStats);
  useEffect(() => {
    if (!dashboardStats) return;
    setChangeData(dashboardStats.change);
    settodayData(dashboardStats.todayStats);
    setTotalBots(dashboardStats.totalBotsCount);
  }, [dashboardStats]);
  console.log(todayData);
  return (
    <div className="grid grid-cols-2 gap-4 p-10 h-full">
      <div className="h-full flex flex-col gap-4">
        <Card className="relative h-[350px] overflow-hidden p-0 group">
          <img
            src={loginbg}
            alt="D-Rube Labs"
            className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-300"
          />
        </Card>
        <GradientBarChart />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Total Bots"
          value={totalBots || "__"}
          icon={Bot}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Active Bots"
          value={Math.round(todayData?.activeBots) || "__"}
          icon={Bot}
          change={`${Math.round(changeData?.activeBots) === 0 ? 0 : Math.round(changeData?.activeBots) || "__"}`}
          period="Change"
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          title="Operators"
          value={Math.round(todayData?.operators) || "__"}
          icon={Wrench}
          change={`${Math.round(changeData?.operators) === 0 ? 0 : Math.round(changeData?.operators) || "__"}`}
          period="Change"
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
        <StatCard
          title="Avarage Battery"
          value={
            Math.round(todayData?.avgBattery) === 0
              ? 0
              : Math.round(todayData?.avgBattery) + " %" || "__"
          }
          icon={BatteryCharging}
          change={`${Math.round(changeData?.avgBattery) === 0 ? 0 : Math.round(todayData?.avgBattery) || "__"}`}
          period="Change"
          iconColor="text-cyan-600"
          iconBg="bg-cyan-50"
        />
        <StatCard
          title="Avarage Distance"
          value={
            Math.round(todayData?.avgDistance) === 0
              ? 0
              : Math.round(todayData?.avgDistance) || "__"
          }
          icon={MapPinned}
          change={`${Math.round(changeData?.avgDistance) === 0 ? 0 : Math.round(changeData?.avgDistance) || "__"}`}
          period="Change"
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Alerts"
          value={
            Math.round(todayData?.alerts) === 0
              ? 0
              : Math.round(todayData?.alerts) || "__"
          }
          icon={Siren}
          change={`${Math.round(changeData?.alerts) === 0 ? 0 : Math.round(changeData?.alerts) || "__"}`}
          period="Change"
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Avarage Humidity"
          value={Math.round(todayData?.avgHumidity) || "__"}
          icon={Droplets}
          change={`${Math.round(changeData?.avgHumidity) === 0 ? 0 : Math.round(changeData?.avgHumidity) || "__"}`}
          period="Change"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Avarage Temperature"
          value={Math.round(todayData?.avgTemp) + "°C" || "__"}
          icon={Thermometer}
          change={`${Math.round(changeData?.avgTemp) === 0 ? 0 : Math.round(changeData?.avgTemp) || "__"}`}
          period="Change"
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
      </div>
    </div>
  );
};

export default Dashboard;

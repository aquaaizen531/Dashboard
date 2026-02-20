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
  console.log("dashboardStats:", dashboardStats);
  useEffect(() => {
    if (!dashboardStats) return;
    setChangeData(dashboardStats.change);
    settodayData(dashboardStats.today);
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
          value={todayData?.totalbots || "__"}
          icon={Bot}
          change={`${changeData?.totalbots === 0 ? 0 : changeData?.totalbots || "__"}`}
          period="Change"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Active Bots"
          value={todayData?.activeBots || "__"}
          icon={Bot}
          change={`${changeData?.activeBots === 0 ? 0 : changeData?.activeBots || "__"}`}
          period="Change"
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          title="Operators"
          value={todayData?.operators || "__"}
          icon={Wrench}
          change={`${changeData?.operators === 0 ? 0 : changeData?.operators || "__"}`}
          period="Change"
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
        <StatCard
          title="Avarage Battery"
          value={
            todayData?.avgBattery === 0 ? 0 : todayData?.avgBattery || "__"
          }
          icon={BatteryCharging}
          change={`${changeData?.avgBattery === 0 ? 0 : changeData?.avgBattery || "__"}`}
          period="Change"
          iconColor="text-cyan-600"
          iconBg="bg-cyan-50"
        />
        <StatCard
          title="Avarage Distance"
          value={todayData?.avgDistance || "__"}
          icon={MapPinned}
          change={`${changeData?.avgDistance === 0 ? 0 : changeData?.avgDistance || "__"}`}
          period="Change"
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Alerts"
          value={todayData?.alerts === 0 ? 0 : todayData?.alerts || "__"}
          icon={Siren}
          change={`${changeData?.alerts === 0 ? 0 : changeData?.alerts || "__"}`}
          period="Change"
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
            title="Avarage Humidity"
            value={todayData?.avgHumidity + "%" || "__"}
            icon={Droplets}
            change={`${changeData?.avgHumidity === 0 ? 0 : changeData?.avgHumidity || "__"}`}
            period="Change"
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard
            title="Active Bots"
            value={todayData?.avgTemp + "°C" || "__"}
            icon={Thermometer}
            change={`${changeData?.avgTemp === 0 ? 0 : changeData?.avgTemp || "__"}`}
            period="Change"
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
          />
      </div>
    </div>
  );
};

export default Dashboard;

import React from "react";
import "../css/overview.css";
import Barchart from "./charts/Barchart";
import HumidityChart from "./charts/HumidityChart";
import DistanceChart from "./charts/DistanceChart";
import StatusChart from "./charts/StatusChart";
import BatteryChart from "./charts/BatteryChart";

const Overview = () => {
  return (
    <div
      className="
      transition-colors
      duration-300
      p-3
      overflow-y-auto
      grid
      grid-cols-1
      lg:grid-cols-2
      gap-2
      items-start
    "
    >
      <Barchart />
      <StatusChart />
      <BatteryChart />
      <HumidityChart />

      <div className="lg:col-span-2">
        <DistanceChart />
      </div>
    </div>
  );
};

export default Overview;

import React from "react";
import "../css/Bg.css";
import "../css/Home.css";
import Header from "../components/Header";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const Home = () => {
  const location = useLocation();
  const currentsection = (path) => {
    switch (path) {
      case "/":
        return "Dashboard";
      case "/overview":
        return "Overview";
      case "/livemap":
        return "Live Map";
      case "/usermanagement":
        return "User Management";
      case "/userlog":
        return "User Logs";
      case "/analysis":
        return "Analysis";
      default:
        return "Unknown";
    }
  };
  const activeSection = currentsection(location.pathname);

  return (
    <div
      id="main-wrapper"
      data-layout="vertical"
      data-sidebar-style="full"
      className="show h-screen flex flex-row home-bg overflow-x-hidden overflow-y-auto"
      // style={{ backgroundImage: `url(${bg})` }}
    >
      <Sidebar />

      {/* header and outlet div */}
      <div className=" min-w-0 shadow-2xl flex flex-col flex-1 ">
        <div className="">
          <Header activeSection={activeSection} />
        </div>
        <div className="flex flex-1 pb-1  min-h-0 overflow-x-hidden">
          <div className="relative home-main-div flex-1  backdrop-blur-2xl min-h-0 ">
            <div className=" flex-1 outlet w-full max-w-full rounded-b-sm overflow-y-auto min-h-0">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

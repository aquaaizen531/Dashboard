/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "../config/axios.config";
import socket from "../config/socket";

const BotContext = createContext();
export const BotProvider = ({ children }) => {
  const [botData, setbotData] = useState([]);
  const [dashboardStats, setdashboardStats] = useState(null);
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("/verify");
        if (res.status === 200) {
          socket.connect();
        }
      } catch (error) {
        console.log(error.message || error, ": Not authenticated");
      }
    };
    verifyUser();
  }, []);
  useEffect(() => {
    socket.on("botData", (data) => {
      setbotData(data);
    });
    socket.on("dashboardStats", (data) => {
      setdashboardStats(data);
    });
    socket.on("connect", () => {
      socket.emit("initDashboard");
    });
    return () => {
      socket.off("botData");
      socket.off("dashboardStats");
      socket.off("connect");
    };
  }, []);

  return (
    <BotContext.Provider
      value={{
        botData,
        setbotData,
        dashboardStats,
        setdashboardStats,
      }}
    >
      {children}
    </BotContext.Provider>
  );
};
export const useBotData = () => useContext(BotContext);

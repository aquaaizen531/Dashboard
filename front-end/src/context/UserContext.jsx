/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from "react";
import axios from "../config/axios.config";
import { useNavigate } from "react-router-dom";
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userDetails, setuserDetails] = useState(null);
  const mefetch = async () => {
    axios
      .get("/me")
      .then((res) => setuserDetails(res.data.user))
      .catch((err) => {
        console.log("session expired", err);
        setuserDetails(null);
        navigate("/login");
      });
  };
  useEffect(() => {
    mefetch();
  }, []);
  // useEffect(() => {
  //   if (!userDetails) return;

  //   const interval = setInterval(() => {
  //     axios.post("/presence/ping");
  //   }, 25000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [userDetails]);
  return (
    <UserContext.Provider value={{ userDetails, setuserDetails, mefetch }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUserDetails = () => useContext(UserContext);

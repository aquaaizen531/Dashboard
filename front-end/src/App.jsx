import React from "react";
import Login from "./pages/Login";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import { BotProvider } from "./context/BotContext";
import { useUserDetails } from "./context/UserContext";
import AutoLogout from "./config/AutoLogout";
import ThemeApplier from "./context/ThemeApplier";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Dashboard from "./features/custom/components/Dashboard";
import Overview from "./features/custom/components/Overview";
import Map from "./features/map/components/Map";
import UserManagement from "./features/admin/user_management/components/UserManagement";
import UserLogs from "./features/admin/user_log/components/UserLogs";
import Analysis from "./features/analysis/components/Analysis";
import Profile from "./features/profile/componets/Profile";

const App = () => {
  const { userDetails } = useUserDetails();
  const role = userDetails?.role;
  const location = useLocation();
  const isLoginpage = location.pathname === "/login";
  return (
    <>
      <ThemeApplier />
      <div>
        <ToastContainer />
        <Toaster />
        {isLoginpage ? (
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        ) : (
          <AutoLogout>
            <>
              {userDetails ? (
                <BotProvider>
                  <Routes>
                    <Route element={<ProtectedRoutes />}>
                      <Route path="/" element={<Home />}>
                        {(role === "operator" ||
                          role === "admin" ||
                          role === "analyst") && (
                          <>
                            <Route index element={<Dashboard />} />
                            <Route path="overview" element={<Overview />} />
                            <Route path="livemap" element={<Map />} />
                          </>
                        )}
                        {role === "admin" && (
                          <>
                            <Route
                              path="usermanagement"
                              element={<UserManagement />}
                            />
                          </>
                        )}
                        {(role === "admin" || role === "analyst") && (
                          <>
                            <Route path="userlog" element={<UserLogs />} />
                            <Route path="analysis" element={<Analysis />} />
                          </>
                        )}
                      </Route>
                      <Route path="profile" element={<Profile />} />
                    </Route>
                  </Routes>
                </BotProvider>
              ) : (
                <div>
                  <Spinner />
                </div>
              )}
            </>
          </AutoLogout>
        )}
      </div>
    </>
  );
};

export default App;

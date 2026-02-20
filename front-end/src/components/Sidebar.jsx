import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Users,
  BarChart3,
  Compass,
  NotebookPen,
  HomeIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import "../css/sidebar.css";

export default function Sidebar({ role = "admin" }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: HomeIcon,
      roles: ["admin", "analyst", "user"],
    },
    {
      path: "/overview",
      label: "Overview",
      icon: LayoutDashboard,
      roles: ["admin", "analyst", "user"],
    },
    {
      path: "/livemap",
      label: "Live Map",
      icon: Map,
      roles: ["admin"],
    },
    {
      path: "/usermanagement",
      label: "User Management",
      icon: Users,
      roles: ["admin"],
    },
    {
      path: "/analysis",
      label: "Analysis",
      icon: BarChart3,
      roles: ["admin", "analyst"],
    },
    {
      path: "/userlog",
      label: "User Logs",
      icon: NotebookPen,
      roles: ["admin", "analyst"],
    },
  ];

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 645;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  return (
    <div
      className={cn(
        "relative flex flex-col h-screen transition-all duration-300 border-r",
        isCollapsed ? "w-[70px]" : isMobile ? "w-[200px]" : "w-[250px]",
      )}
      style={{
        backgroundColor: "var(--primary-bg-color)",
        color: "var(--primary-text-color)",
        borderColor: "var(--secondary-bg-color)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: "var(--secondary-bg-color)" }}
      >
        <Compass className="w-8 h-8 flex-shrink-0" />
        {!isCollapsed && (
          <span className="text-lg font-bold tracking-wide">SCOUT V12</span>
        )}
      </div>

      {/* Collapse Toggle */}
      <div className=" absolute -right-16 top-4 z-50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="group flex flex-col justify-center gap-1.5 w-8 h-8 "
        >
          <span className="line" />
          <span className="line" />
          <span className="line short" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                    )}
                    style={{
                      backgroundColor: isActive
                        ? "var(--sidebar-active-color)"
                        : "transparent",
                      color: isActive
                        ? "var(--primary-text-color)"
                        : "var(--primary-text-color)",
                      borderBottomRightRadius: isActive && "90px",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor =
                          "var(--secondary-bg-color)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* Copyright */}
      {!isCollapsed && (
        <div
          className="px-4 py-3"
          style={{ borderTop: `1px solid var(--secondary-bg-color)` }}
        >
          <p
            className="text-xs text-center"
            style={{ color: "var(--secondary-text-color)" }}
          >
            <strong style={{ color: "var(--primary-text-color)" }}>
              DRube-Labs
            </strong>{" "}
            © 2024
          </p>
          <p
            className="text-xs text-center mt-1"
            style={{ color: "var(--secondary-text-color)" }}
          >
            All Rights Reserved
          </p>
        </div>
      )}
    </div>
  );
}


import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LineChart, WalletCards, Lightbulb, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Market", path: "/market", icon: LineChart },
    { name: "Finance", path: "/finance", icon: WalletCards },
    { name: "Insights", path: "/insights", icon: Lightbulb },
    { name: "Profile", path: "/profile", icon: User }
  ];

  return (
    <div className="min-h-screen bg-finance-background flex flex-col">
      <main className="flex-1 overflow-auto pb-16">{children}</main>
      
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-2 px-4",
                currentPath === item.path
                  ? "text-finance-primary"
                  : "text-gray-500 hover:text-finance-secondary"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;

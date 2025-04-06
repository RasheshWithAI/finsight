
import React, { useEffect } from "react";
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

  // Add subtle haptic feedback for navigation
  const handleNavClick = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(20); // subtle 20ms vibration
    }
  };

  return (
    <div className="min-h-screen bg-aura-white flex flex-col">
      <main className="flex-1 overflow-auto pb-16 animate-fade-in">{children}</main>
      
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 glass-effect shadow-lg border-t border-white/20">
        <div className="flex justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-3 px-4",
                  isActive 
                    ? "nav-item-active" 
                    : "nav-item-inactive"
                )}
                onClick={handleNavClick}
              >
                <item.icon 
                  className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isActive ? "scale-110" : ""
                  )} 
                />
                <span className={cn(
                  "text-xs mt-1 transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {item.name}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-10 h-1 bg-primary-gradient rounded-full animate-fade-in" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;

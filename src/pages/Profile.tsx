
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User,
  Settings,
  Bell,
  LogOut,
  Mail,
  Shield,
  ScanLine,
  CreditCard,
  Lock,
  HelpCircle,
  ChevronRight,
  Cloud,
  RefreshCcw
} from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      logout();
      toast.success("You've been logged out");
      navigate("/");
      setIsLoading(false);
    }, 500);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container px-4 py-6 pb-20 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">
          Profile & Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </header>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(user?.name || user?.email || "User")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-3 grow">
              <div>
                <Label htmlFor="name" className="text-muted-foreground text-sm block mb-1">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue={user?.name || ""}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-muted-foreground text-sm block mb-1">
                  Email
                </Label>
                <Input
                  id="email"
                  defaultValue={user?.email || ""}
                  placeholder="Your email"
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings List */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <Settings className="h-5 w-5 mr-2" /> Settings
        </h2>
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-muted mr-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage your alerts and notifications</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-muted mr-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Security</h3>
                  <p className="text-sm text-muted-foreground">Password and two-factor authentication</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-muted mr-3">
                  <Cloud className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Google Sheets Integration</h3>
                  <p className="text-sm text-muted-foreground">Link and manage your spreadsheets</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-muted mr-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Currency</h3>
                  <p className="text-sm text-muted-foreground">Set your preferred currency</p>
                </div>
              </div>
              <div className="text-sm font-medium">USD</div>
            </div>
          </div>
        </Card>
      </section>

      {/* Preferences */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Preferences</h2>
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="market-alerts" className="font-medium">Market Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive alerts about market changes</p>
              </div>
              <Switch id="market-alerts" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="budget-alerts" className="font-medium">Budget Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when approaching budget limits</p>
              </div>
              <Switch id="budget-alerts" checked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-insights" className="font-medium">AI Insights</Label>
                <p className="text-sm text-muted-foreground">Allow AI to analyze your data for personalized tips</p>
              </div>
              <Switch id="ai-insights" checked />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Help & Support */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <HelpCircle className="h-5 w-5 mr-2" /> Help & Support
        </h2>
        <Card>
          <CardContent className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              Documentation & Tutorials
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              Contact Support
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              Privacy Policy
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              Terms of Service
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Account Actions */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Account</h2>
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => toast.info("Data refresh initiated")}
            className="w-full justify-start text-muted-foreground"
          >
            <RefreshCcw className="h-4 w-4 mr-2" /> Refresh Data
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoading ? "Logging out..." : "Log Out"}
          </Button>
        </div>
      </section>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Aura Finance v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Profile;

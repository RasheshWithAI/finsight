
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, User, Bell, Shield, CreditCard, Settings, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import AryaNotificationSettings from "@/components/arya/AryaNotificationSettings";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out");
    navigate("/");
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container px-4 py-6 animate-fade-in pb-20">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-aura-primary-text">Profile</h1>
        <p className="text-aura-secondary-text">Manage your account and preferences</p>
      </header>

      {/* User Profile Card */}
      <Card className="financial-card mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL || ""} alt={user?.name || "User"} />
              <AvatarFallback className="text-xl bg-primary text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left space-y-1 flex-1">
              <h2 className="text-xl font-bold text-aura-primary-text">{user?.name || "User"}</h2>
              <p className="text-aura-secondary-text">{user?.email}</p>
              <p className="text-sm text-aura-gold">Premium Member</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="mt-2 sm:mt-0">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="preferences">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize how the app looks and behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="text-aura-primary-text">Dark Mode</Label>
                  <p className="text-sm text-aura-secondary-text">
                    Use dark theme throughout the app
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  disabled={true}
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="language" className="text-aura-primary-text">Language</Label>
                <select
                  id="language"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-2"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-aura-primary-text">Currency</Label>
                <select
                  id="currency"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-2"
                >
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="gbp">GBP (£)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="biometrics" className="text-aura-primary-text">
                    Biometric Authentication
                  </Label>
                  <p className="text-sm text-aura-secondary-text">
                    Use fingerprint or Face ID to unlock the app
                  </p>
                </div>
                <Switch
                  id="biometrics"
                  checked={biometrics}
                  onCheckedChange={setBiometrics}
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-aura-primary-text">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  className="bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-aura-primary-text">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  className="bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-aura-primary-text">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  className="bg-gray-800"
                />
              </div>

              <Button className="w-full mt-4">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-aura-gold" />
                  <CardTitle>App Notifications</CardTitle>
                </div>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-aura-primary-text">
                      Enable Notifications
                    </Label>
                    <p className="text-sm text-aura-secondary-text">
                      Receive updates, alerts, and important information
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <Separator className="my-2" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="budget-alerts" className="text-aura-primary-text">
                      Budget Alerts
                    </Label>
                    <p className="text-sm text-aura-secondary-text">
                      Get notified when approaching budget limits
                    </p>
                  </div>
                  <Switch id="budget-alerts" defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="stock-alerts" className="text-aura-primary-text">
                      Stock Alerts
                    </Label>
                    <p className="text-sm text-aura-secondary-text">
                      Receive updates about your watchlisted stocks
                    </p>
                  </div>
                  <Switch id="stock-alerts" defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="new-features" className="text-aura-primary-text">
                      New Features
                    </Label>
                    <p className="text-sm text-aura-secondary-text">
                      Stay informed about new app features and updates
                    </p>
                  </div>
                  <Switch id="new-features" defaultChecked={false} />
                </div>
              </CardContent>
            </Card>

            {/* Arya Notification Settings */}
            <AryaNotificationSettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;

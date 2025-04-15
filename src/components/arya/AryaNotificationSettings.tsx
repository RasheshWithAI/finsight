
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Lightbulb, TrendingUp, PiggyBank } from 'lucide-react';

const AryaNotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    stockMovements: true,
    savingsTips: true,
    aiInsights: true
  });

  const handleToggleChange = (setting: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-[#3F51B5]" />
          <CardTitle>Arya Notifications</CardTitle>
        </div>
        <CardDescription>
          Customize when Arya can send you notifications and insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-red-900/30">
              <Bell className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <Label htmlFor="budget-alerts" className="text-white">Budget Alerts</Label>
              <p className="text-sm text-gray-400">Get notified when approaching budget limits</p>
            </div>
          </div>
          <Switch
            id="budget-alerts"
            checked={notifications.budgetAlerts}
            onCheckedChange={() => handleToggleChange('budgetAlerts')}
            className="data-[state=checked]:bg-[#3F51B5]"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-blue-900/30">
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <Label htmlFor="stock-movements" className="text-white">Stock Movements</Label>
              <p className="text-sm text-gray-400">Get notified about significant movements in your watchlist</p>
            </div>
          </div>
          <Switch
            id="stock-movements"
            checked={notifications.stockMovements}
            onCheckedChange={() => handleToggleChange('stockMovements')}
            className="data-[state=checked]:bg-[#3F51B5]"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-green-900/30">
              <PiggyBank className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <Label htmlFor="savings-tips" className="text-white">Savings Tips</Label>
              <p className="text-sm text-gray-400">Receive personalized savings suggestions</p>
            </div>
          </div>
          <Switch
            id="savings-tips"
            checked={notifications.savingsTips}
            onCheckedChange={() => handleToggleChange('savingsTips')}
            className="data-[state=checked]:bg-[#3F51B5]"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-purple-900/30">
              <Lightbulb className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <Label htmlFor="ai-insights" className="text-white">AI Insights</Label>
              <p className="text-sm text-gray-400">Get proactive financial insights and recommendations</p>
            </div>
          </div>
          <Switch
            id="ai-insights"
            checked={notifications.aiInsights}
            onCheckedChange={() => handleToggleChange('aiInsights')}
            className="data-[state=checked]:bg-[#3F51B5]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AryaNotificationSettings;


import { useState } from "react";
import { SubscriptionCard } from "./SubscriptionCard";
import { PricingModal } from "../premium/PricingModal";

interface SubscriptionSectionProps {
  currentSubscription: string;
}

export function SubscriptionSection({ currentSubscription }: SubscriptionSectionProps) {
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const handleUpgrade = () => {
    setIsPricingOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-aura-primary-text">Subscription</h2>
          <p className="text-aura-secondary-text">Manage your subscription plan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SubscriptionCard
          name="Free"
          description="Basic access to the app"
          price={0}
          features={[
            "Basic financial summary",
            "Simple market data",
            "Stock watchlist",
            "Basic AI insights"
          ]}
          isCurrentPlan={currentSubscription === 'free'}
          onSelect={handleUpgrade}
        />
        <SubscriptionCard
          name="Pro"
          description="Advanced features and analytics"
          price={19.99}
          features={[
            "Advanced financial analytics",
            "Real-time market data",
            "Unlimited watchlists",
            "Advanced AI insights",
            "Portfolio optimization"
          ]}
          isCurrentPlan={currentSubscription === 'pro'}
          onSelect={handleUpgrade}
        />
        <SubscriptionCard
          name="Enterprise"
          description="Complete access to all features"
          price={49.99}
          features={[
            "Complete financial suite",
            "Level 2 market data",
            "Custom investment strategies",
            "Premium AI research assistant",
            "Advanced tax optimization",
            "Dedicated account manager"
          ]}
          isCurrentPlan={currentSubscription === 'enterprise'}
          onSelect={handleUpgrade}
        />
      </div>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </div>
  );
}

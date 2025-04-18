
import { useState, useEffect } from "react";
import { SubscriptionCard } from "./SubscriptionCard";
import { PricingModal } from "../premium/PricingModal";
import { Button } from "@/components/ui/button";
import { RefreshCw, CreditCard } from "lucide-react";
import { openCustomerPortal, refreshSubscriptionStatus } from "@/utils/subscriptionUtils";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { SubscriptionTier } from "@/utils/subscriptionUtils";

interface SubscriptionSectionProps {
  currentSubscription: string;
}

export function SubscriptionSection({ currentSubscription: initialSubscription }: SubscriptionSectionProps) {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [subscription, setSubscription] = useState<string>(initialSubscription);
  const { user } = useAuth();

  // Check for subscription success query param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('subscription_success');
    
    if (success === 'true') {
      // Remove the query param without page reload
      const newUrl = window.location.pathname + 
        window.location.search.replace(/(\?|&)subscription_success=true/, '');
      window.history.replaceState({}, document.title, newUrl);
      
      // Show success message
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been successfully updated!",
      });
      
      // Refresh subscription status
      handleRefreshSubscription();
    }
  }, []);

  const handleUpgrade = () => {
    setIsPricingOpen(true);
  };
  
  const handleManageSubscription = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage your subscription.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPortalLoading(true);
    
    try {
      const result = await openCustomerPortal();
      
      if (!result.success) {
        throw new Error(result.message || "Failed to open customer portal");
      }
      
      // User is redirected by the utility function if successful
      
    } catch (error) {
      console.error("Customer portal error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      toast({
        title: "Portal Access Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsPortalLoading(false);
    }
  };
  
  const handleRefreshSubscription = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    
    try {
      const result = await refreshSubscriptionStatus();
      
      if (result.success && result.subscription) {
        setSubscription(result.subscription);
        
        toast({
          title: "Subscription Refreshed",
          description: `Your current plan: ${result.subscription.charAt(0).toUpperCase() + result.subscription.slice(1)}`,
        });
      } else {
        throw new Error(result.message || "Failed to refresh subscription status");
      }
    } catch (error) {
      console.error("Refresh error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      toast({
        title: "Refresh Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-aura-primary-text">Subscription</h2>
          <p className="text-aura-secondary-text">Manage your subscription plan</p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshSubscription}
            disabled={isRefreshing || !user}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {subscription !== 'free' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageSubscription}
              disabled={isPortalLoading || !user}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isPortalLoading ? 'Loading...' : 'Manage Billing'}
            </Button>
          )}
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
          isCurrentPlan={subscription === 'free'}
          onSelect={() => setSubscription('free')}
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
          isCurrentPlan={subscription === 'pro'}
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
          isCurrentPlan={subscription === 'enterprise'}
          onSelect={handleUpgrade}
        />
      </div>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </div>
  );
}

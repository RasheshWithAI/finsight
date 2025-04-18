
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Define a strict type for subscription tiers
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export async function getUserSubscription(userId: string): Promise<SubscriptionTier> {
  const { data, error } = await supabase.rpc('get_user_subscription', {
    p_user_id: userId
  });
  
  if (error) {
    console.error('Error fetching subscription:', error);
    return 'free';
  }
  
  // Add type assertion to ensure the returned value is of type SubscriptionTier
  return (data as SubscriptionTier) || 'free';
}

// Define subscription tiers as const arrays with type assertion
export const FEATURE_ACCESS = {
  REAL_TIME_DATA: ['pro', 'enterprise'] as const,
  ADVANCED_CHARTS: ['pro', 'enterprise'] as const,
  PORTFOLIO_ANALYSIS: ['enterprise'] as const,
  AI_INSIGHTS: ['pro', 'enterprise'] as const,
  EXPORT: ['enterprise'] as const
} as const;

type FeatureAccessMap = typeof FEATURE_ACCESS;
type Feature = keyof FeatureAccessMap;

// Type-safe feature access check
export function hasFeatureAccess(
  subscription: SubscriptionTier, 
  feature: Feature
): boolean {
  if (!FEATURE_ACCESS[feature]) return true;
  
  const allowedTiers = FEATURE_ACCESS[feature];
  return (allowedTiers as readonly SubscriptionTier[]).includes(subscription);
}

// Function to handle Stripe checkout for subscription upgrades
export async function initiateSubscriptionCheckout(
  tierCode: SubscriptionTier
): Promise<{success: boolean, url?: string, message?: string}> {
  try {
    // For free tier, we handle locally
    if (tierCode === 'free') {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        toast({
          title: "Authentication required",
          description: "Please sign in to change your subscription.",
          variant: "destructive"
        });
        return { success: false, message: "Authentication required" };
      }
      
      const response = await supabase.functions.invoke('create-checkout', {
        body: { tierCode },
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to process free subscription");
      }
      
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been updated to the Free tier.",
      });
      
      // Refresh the page to show updated subscription
      window.location.reload();
      return { success: true };
    }
    
    // For paid tiers, create a Stripe checkout session
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.access_token) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upgrade your subscription.",
        variant: "destructive"
      });
      return { success: false, message: "Authentication required" };
    }
    
    const response = await supabase.functions.invoke('create-checkout', {
      body: { tierCode },
    });
    
    if (response.error) {
      throw new Error(response.error.message || "Failed to create checkout session");
    }
    
    // Redirect to Stripe Checkout
    if (response.data?.url) {
      window.location.href = response.data.url;
      return { success: true, url: response.data.url };
    } else {
      throw new Error("No checkout URL returned");
    }
  } catch (error) {
    console.error('Error initiating checkout:', error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    
    toast({
      title: "Checkout Failed",
      description: errorMessage,
      variant: "destructive"
    });
    
    return { success: false, message: errorMessage };
  }
}

// Function to open Stripe customer portal for subscription management
export async function openCustomerPortal(): Promise<{success: boolean, url?: string, message?: string}> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.access_token) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage your subscription.",
        variant: "destructive"
      });
      return { success: false, message: "Authentication required" };
    }
    
    const response = await supabase.functions.invoke('customer-portal', {});
    
    if (response.error) {
      throw new Error(response.error.message || "Failed to open customer portal");
    }
    
    // Redirect to Customer Portal
    if (response.data?.url) {
      window.location.href = response.data.url;
      return { success: true, url: response.data.url };
    } else {
      throw new Error("No portal URL returned");
    }
  } catch (error) {
    console.error('Error opening customer portal:', error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    
    toast({
      title: "Portal Access Failed",
      description: errorMessage,
      variant: "destructive"
    });
    
    return { success: false, message: errorMessage };
  }
}

// Function to manually refresh subscription status
export async function refreshSubscriptionStatus(): Promise<{success: boolean, subscription?: SubscriptionTier, message?: string}> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.access_token) {
      return { success: false, message: "Authentication required" };
    }
    
    const response = await supabase.functions.invoke('check-subscription', {});
    
    if (response.error) {
      throw new Error(response.error.message || "Failed to refresh subscription status");
    }
    
    // If successful, return the subscription tier
    if (response.data?.subscription_tier) {
      return { 
        success: true, 
        subscription: response.data.subscription_tier as SubscriptionTier 
      };
    } else {
      return { success: true, subscription: 'free' };
    }
  } catch (error) {
    console.error('Error refreshing subscription:', error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return { success: false, message: errorMessage };
  }
}

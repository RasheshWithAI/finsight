
import { supabase } from "@/integrations/supabase/client";

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

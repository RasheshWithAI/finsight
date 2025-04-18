
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionTier = {
  code: 'free' | 'pro' | 'enterprise';
  name: string;
  description: string;
  price: number;
};

export async function getUserSubscription(userId: string): Promise<string> {
  const { data, error } = await supabase.rpc('get_user_subscription', {
    p_user_id: userId
  });
  
  if (error) {
    console.error('Error fetching subscription:', error);
    return 'free';
  }
  
  return data || 'free';
}

export const FEATURE_ACCESS = {
  REAL_TIME_DATA: ['pro', 'enterprise'] as const,
  ADVANCED_CHARTS: ['pro', 'enterprise'] as const,
  PORTFOLIO_ANALYSIS: ['enterprise'] as const,
  AI_INSIGHTS: ['pro', 'enterprise'] as const,
  EXPORT: ['enterprise'] as const
} as const;

type FeatureAccessMap = typeof FEATURE_ACCESS;
type Feature = keyof FeatureAccessMap;
type AllowedTiers = FeatureAccessMap[Feature][number];

export function hasFeatureAccess(subscription: string, feature: Feature): boolean {
  if (!FEATURE_ACCESS[feature]) return true;
  return FEATURE_ACCESS[feature].includes(subscription as AllowedTiers);
}

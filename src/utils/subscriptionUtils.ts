
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
  REAL_TIME_DATA: ['pro', 'enterprise'],
  ADVANCED_CHARTS: ['pro', 'enterprise'],
  PORTFOLIO_ANALYSIS: ['enterprise'],
  AI_INSIGHTS: ['pro', 'enterprise'],
  EXPORT: ['enterprise']
} as const;

export function hasFeatureAccess(subscription: string, feature: keyof typeof FEATURE_ACCESS): boolean {
  if (!FEATURE_ACCESS[feature]) return true;
  return FEATURE_ACCESS[feature].includes(subscription);
}

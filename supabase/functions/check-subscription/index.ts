
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key to perform writes (upsert) in Supabase
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    // Use regular client for auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, checking for free subscription in database");
      
      // Check if the user has a free subscription directly in the database
      const { data: freeSubData } = await supabaseClient
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .eq("tier_code", "free")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
        
      if (freeSubData) {
        logStep("Found active free subscription in database", { subscription: freeSubData });
        return new Response(JSON.stringify({ 
          subscribed: true,
          subscription_tier: "free",
          subscription_end: null
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      // No customer and no free subscription, returning default free tier
      logStep("No customer found and no free subscription, updating unsubscribed state");
      return new Response(JSON.stringify({ subscribed: false, subscription_tier: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = "free";
    let subscriptionEnd = null;
    let stripeSubscriptionId = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      stripeSubscriptionId = subscription.id;
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      // Get the product/price info to determine tier
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      
      // Get product details to determine tier
      if (price.product && typeof price.product === 'string') {
        const product = await stripe.products.retrieve(price.product);
        
        // Try to extract tier from product metadata or name
        if (product.metadata && product.metadata.tier_code) {
          subscriptionTier = product.metadata.tier_code;
        } else if (product.name) {
          // Fallback to name-based logic
          const name = product.name.toLowerCase();
          if (name.includes('enterprise')) {
            subscriptionTier = 'enterprise';
          } else if (name.includes('pro')) {
            subscriptionTier = 'pro';
          }
        }
      }
      
      // If unable to determine tier, fallback to price-based logic
      if (subscriptionTier === "free" && price.unit_amount) {
        const amount = price.unit_amount;
        if (amount >= 4000) {
          subscriptionTier = "enterprise";
        } else if (amount >= 1000) {
          subscriptionTier = "pro";
        }
      }
      
      logStep("Determined subscription tier", { subscriptionTier });
    } else {
      logStep("No active subscription found in Stripe");
      
      // Check for an active free tier in DB
      const { data: freeSubData } = await supabaseClient
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .eq("tier_code", "free")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
        
      if (freeSubData) {
        logStep("Found active free subscription in database", { subscription: freeSubData });
        subscriptionTier = "free";
        hasActiveSub = true;
      }
    }

    // Update the database with the latest subscription info
    if (subscriptionTier !== "free" || hasActiveSub) {
      await supabaseAdmin.from("user_subscriptions").upsert({
        user_id: user.id,
        tier_code: subscriptionTier,
        stripe_subscription_id: stripeSubscriptionId,
        starts_at: new Date().toISOString(),
        expires_at: subscriptionEnd,
        is_active: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,tier_code,is_active' });
    }

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage, subscription_tier: 'free' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

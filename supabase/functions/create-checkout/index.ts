
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");
    
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");
    
    // Parse request body
    const requestData = await req.json();
    const { tierCode } = requestData;
    logStep("Request data parsed", { tierCode });
    
    if (!tierCode) throw new Error("No tier code provided");
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Authenticate user
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });
    
    // Get tier pricing information
    const { data: tierData, error: tierError } = await supabaseClient
      .from("subscription_tiers")
      .select("*")
      .eq("code", tierCode)
      .single();
      
    if (tierError) throw new Error(`Error fetching tier data: ${tierError.message}`);
    if (!tierData) throw new Error("Subscription tier not found");
    logStep("Tier data fetched", { tierData });
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if user already has a Stripe customer account
    let customerId;
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing Stripe customer found", { customerId });
    } else {
      logStep("Creating new Stripe customer");
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("New Stripe customer created", { customerId });
    }
    
    // Get success and cancel URLs from request headers
    const origin = req.headers.get("origin") || "http://localhost:5173";
    const successUrl = `${origin}/profile?subscription_success=true`;
    const cancelUrl = `${origin}/profile`;
    
    logStep("Creating checkout session", {
      customerId,
      tierCode,
      price: tierData.price
    });
    
    // For free tier, skip Stripe and update subscription directly
    if (tierCode === 'free' || tierData.price === 0) {
      logStep("Processing free tier subscription");
      
      // Create a service role client to bypass RLS
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );
      
      // Deactivate existing subscriptions
      await adminClient
        .from("user_subscriptions")
        .update({ is_active: false })
        .eq("user_id", user.id);
      
      // Create new subscription
      await adminClient
        .from("user_subscriptions")
        .insert({
          user_id: user.id,
          tier_code: tierCode,
          starts_at: new Date().toISOString(),
          is_active: true
        });
      
      logStep("Free subscription activated");
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Free subscription activated",
        redirect: successUrl
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      });
    }
    
    // For paid tiers, create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${tierData.name} Subscription`,
              description: tierData.description || `${tierData.name} tier subscription`,
            },
            unit_amount: Math.round(parseFloat(tierData.price) * 100), // Convert to cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
        tier_code: tierCode
      },
    });
    
    logStep("Checkout session created", { sessionId: session.id, url: session.url });
    
    return new Response(JSON.stringify({ 
      sessionId: session.id,
      url: session.url
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // CORS handling
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    logStep("Function started");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    
    logStep("API keys verified");
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No Stripe signature found");
    
    // Get request body as text for verification
    const body = await req.text();
    
    // Verify and construct the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const error = err as Error;
      logStep(`Webhook signature verification failed: ${error.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${error.message}` }), 
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    logStep("Webhook verified", { type: event.type });
    
    // Initialize Supabase admin client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout.session.completed", { 
          id: session.id,
          customer: session.customer, 
          metadata: session.metadata 
        });
        
        // Extract metadata
        const userId = session.metadata?.user_id;
        const tierCode = session.metadata?.tier_code;
        const subscriptionId = session.subscription as string;
        
        if (userId && tierCode && subscriptionId) {
          // Deactivate existing subscriptions
          await supabaseAdmin
            .from("user_subscriptions")
            .update({ is_active: false })
            .eq("user_id", userId);
            
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const periodEnd = subscription ? new Date(subscription.current_period_end * 1000).toISOString() : null;
          
          // Insert new subscription
          const { error } = await supabaseAdmin
            .from("user_subscriptions")
            .insert({
              user_id: userId,
              tier_code: tierCode,
              stripe_subscription_id: subscriptionId,
              starts_at: new Date().toISOString(),
              expires_at: periodEnd,
              is_active: true
            });
            
          if (error) {
            logStep("Error inserting subscription", { error });
          } else {
            logStep("Successfully inserted subscription");
          }
        } else {
          logStep("Missing required metadata", { userId, tierCode, subscriptionId });
        }
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing customer.subscription.updated", { 
          id: subscription.id, 
          status: subscription.status 
        });
        
        const { data: subData, error: fetchError } = await supabaseAdmin
          .from("user_subscriptions")
          .select("*")
          .eq("stripe_subscription_id", subscription.id)
          .limit(1);
          
        if (fetchError) {
          logStep("Error fetching subscription", { error: fetchError });
          break;
        }
        
        if (subData && subData.length > 0) {
          const isActive = ['active', 'trialing'].includes(subscription.status);
          const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
          
          const { error: updateError } = await supabaseAdmin
            .from("user_subscriptions")
            .update({
              is_active: isActive,
              expires_at: periodEnd,
              updated_at: new Date().toISOString()
            })
            .eq("stripe_subscription_id", subscription.id);
            
          if (updateError) {
            logStep("Error updating subscription", { error: updateError });
          } else {
            logStep("Successfully updated subscription");
          }
        } else {
          logStep("No matching subscription found in database");
        }
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing customer.subscription.deleted", { id: subscription.id });
        
        const { error } = await supabaseAdmin
          .from("user_subscriptions")
          .update({
            is_active: false,
            expires_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("stripe_subscription_id", subscription.id);
          
        if (error) {
          logStep("Error updating subscription", { error });
        } else {
          logStep("Successfully marked subscription as inactive");
        }
        break;
      }
      
      default:
        logStep(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Error processing webhook", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});

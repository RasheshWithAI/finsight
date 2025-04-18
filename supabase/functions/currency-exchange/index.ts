
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Default exchange rate if API fails
const DEFAULT_USD_TO_INR_RATE = 83.50;

// Cache exchange rate and timestamp
const exchangeRateCache: Record<string, { rate: number; timestamp: number }> = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { from, to } = await req.json();
    
    if (!from || !to) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: from and to currencies' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    const cacheKey = `${from}_${to}`;
    const cachedData = exchangeRateCache[cacheKey];
    
    // Check if we have a valid cached rate
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
      console.log(`Using cached exchange rate for ${from} to ${to}: ${cachedData.rate}`);
      return new Response(
        JSON.stringify({ rate: cachedData.rate, source: 'cache' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // For USD to INR, we'll try to fetch from an external API
    if (from === 'USD' && to === 'INR') {
      try {
        // First attempt: Free Currency API
        const response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_FQo7YH5SWwmT4O6LPInUwX0ABGDXZlMaoYdtfm0N&currencies=INR&base_currency=USD`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.data && data.data.INR) {
            const rate = data.data.INR;
            // Update cache
            exchangeRateCache[cacheKey] = { 
              rate, 
              timestamp: Date.now() 
            };
            
            console.log(`Updated exchange rate for ${from} to ${to}: ${rate}`);
            return new Response(
              JSON.stringify({ rate, source: 'freecurrencyapi' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
        
        // Second attempt: Exchange Rate API
        const backupResponse = await fetch(`https://open.er-api.com/v6/latest/USD`);
        
        if (backupResponse.ok) {
          const data = await backupResponse.json();
          if (data && data.rates && data.rates.INR) {
            const rate = data.rates.INR;
            // Update cache
            exchangeRateCache[cacheKey] = { 
              rate, 
              timestamp: Date.now() 
            };
            
            console.log(`Updated exchange rate for ${from} to ${to} (backup source): ${rate}`);
            return new Response(
              JSON.stringify({ rate, source: 'exchangerate-api' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      } catch (error) {
        console.error('Error fetching from currency APIs:', error);
      }
    }
    
    // If all APIs fail or for other currency pairs, use default rate
    console.log(`Using default exchange rate for ${from} to ${to}`);
    return new Response(
      JSON.stringify({ rate: DEFAULT_USD_TO_INR_RATE, source: 'default' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

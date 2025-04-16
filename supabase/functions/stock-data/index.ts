
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
const BASE_URL = 'https://www.alphavantage.co/query';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get params from request depending on method
    let params;
    
    if (req.method === 'POST') {
      // If it's a POST request, get params from the request body
      const body = await req.json();
      params = body;
    } else {
      // For GET requests, get params from URL search params
      const url = new URL(req.url);
      params = Object.fromEntries(url.searchParams);
    }
    
    const action = params.action;
    
    if (!action) {
      return new Response(JSON.stringify({ error: 'Action parameter is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    let apiUrl = '';
    
    switch (action) {
      case 'search':
        const keywords = params.keywords;
        if (!keywords) {
          return new Response(JSON.stringify({ error: 'Keywords parameter is required for search action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        apiUrl = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        break;
        
      case 'quote':
        const symbol = params.symbol;
        if (!symbol) {
          return new Response(JSON.stringify({ error: 'Symbol parameter is required for quote action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        apiUrl = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        break;
        
      case 'daily':
        const dailySymbol = params.symbol;
        if (!dailySymbol) {
          return new Response(JSON.stringify({ error: 'Symbol parameter is required for daily action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        apiUrl = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${dailySymbol}&outputsize=compact&apikey=${ALPHA_VANTAGE_API_KEY}`;
        break;
        
      case 'indices':
        // For market indices, we'll fetch a few key indices
        // We'll call the API multiple times in parallel to get data for different indices
        const indicesSymbols = ['DJI', 'SPX', 'IXIC', 'RUT'];
        const indicesPromises = indicesSymbols.map(indexSymbol => 
          fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${indexSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`)
            .then(res => res.json())
        );
        
        const indicesData = await Promise.all(indicesPromises);
        
        return new Response(JSON.stringify({ indices: indicesData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action parameter' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    
    console.log(`Fetching data from: ${apiUrl}`);
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

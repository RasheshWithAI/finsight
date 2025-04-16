
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get the API key from environment variable
const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
const BASE_URL = 'https://www.alphavantage.co/query';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if API key is available
    if (!ALPHA_VANTAGE_API_KEY) {
      console.error('ALPHA_VANTAGE_API_KEY environment variable is not set');
      return new Response(JSON.stringify({ 
        error: 'API configuration error', 
        message: 'The Alpha Vantage API key is not configured properly'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
        apiUrl = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        break;
        
      case 'quote':
        const symbol = params.symbol;
        if (!symbol) {
          return new Response(JSON.stringify({ error: 'Symbol parameter is required for quote action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        apiUrl = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        break;
        
      case 'daily':
        const dailySymbol = params.symbol;
        if (!dailySymbol) {
          return new Response(JSON.stringify({ error: 'Symbol parameter is required for daily action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        apiUrl = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(dailySymbol)}&outputsize=compact&apikey=${ALPHA_VANTAGE_API_KEY}`;
        break;
        
      case 'indices':
        // For market indices, we'll fetch a few key indices
        // We'll call the API multiple times in parallel to get data for different indices
        const indicesSymbols = ['DJI', 'SPX', 'IXIC', 'RUT'];
        
        try {
          console.log('Fetching indices data...');
          const indicesPromises = indicesSymbols.map(indexSymbol => {
            const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(indexSymbol)}&apikey=${ALPHA_VANTAGE_API_KEY}`;
            console.log(`Fetching index data for ${indexSymbol}: ${url}`);
            return fetch(url)
              .then(res => {
                if (!res.ok) {
                  console.error(`Error fetching ${indexSymbol}: ${res.status} ${res.statusText}`);
                  return { 'Global Quote': {} };
                }
                return res.json();
              })
              .catch(err => {
                console.error(`Network error fetching ${indexSymbol}:`, err);
                return { 'Global Quote': {} };
              });
          });
          
          const indicesData = await Promise.all(indicesPromises);
          console.log('All indices data fetched:', JSON.stringify(indicesData).substring(0, 200) + '...');
          
          return new Response(JSON.stringify({ indices: indicesData }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Error fetching indices:', error);
          return new Response(JSON.stringify({ 
            error: 'Failed to fetch indices data',
            details: error.message 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action parameter' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    
    console.log(`Fetching data from: ${apiUrl}`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ 
        error: 'External API error', 
        status: response.status,
        message: response.statusText
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const data = await response.json();
    
    // Check if we got an API error response
    if (data && data.Note) {
      console.warn('Alpha Vantage API usage limit message:', data.Note);
    }
    
    if (data && data.Error) {
      console.error('Alpha Vantage API error:', data.Error);
      return new Response(JSON.stringify({ 
        error: 'External API error', 
        message: data.Error
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
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

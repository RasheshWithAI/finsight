
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

    console.log('Alpha Vantage API Key is configured:', ALPHA_VANTAGE_API_KEY.substring(0, 3) + '...');

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
        try {
          console.log('Generating mock indices data since Alpha Vantage free tier limits indices access');
          
          // Generate realistic mock data for key market indices since Alpha Vantage free tier often limits indices data
          const mockIndices = [
            {
              'Global Quote': {
                '01. symbol': '^DJI',
                '02. open': '38923.45',
                '03. high': '39102.34',
                '04. low': '38856.23',
                '05. price': '39045.67',
                '06. volume': '345678901',
                '07. latest trading day': new Date().toISOString().split('T')[0],
                '08. previous close': '38867.89',
                '09. change': '177.78',
                '10. change percent': '0.4575%'
              }
            },
            {
              'Global Quote': {
                '01. symbol': '^GSPC',
                '02. open': '5123.45',
                '03. high': '5167.23',
                '04. low': '5098.67',
                '05. price': '5145.32',
                '06. volume': '2345678901',
                '07. latest trading day': new Date().toISOString().split('T')[0],
                '08. previous close': '5110.56',
                '09. change': '34.76',
                '10. change percent': '0.6802%'
              }
            },
            {
              'Global Quote': {
                '01. symbol': '^IXIC',
                '02. open': '16234.56',
                '03. high': '16345.67',
                '04. low': '16123.45',
                '05. price': '16298.76',
                '06. volume': '3456789012',
                '07. latest trading day': new Date().toISOString().split('T')[0],
                '08. previous close': '16198.45',
                '09. change': '100.31',
                '10. change percent': '0.6193%'
              }
            },
            {
              'Global Quote': {
                '01. symbol': '^RUT',
                '02. open': '2056.78',
                '03. high': '2078.90',
                '04. low': '2032.45',
                '05. price': '2067.34',
                '06. volume': '1234567890',
                '07. latest trading day': new Date().toISOString().split('T')[0],
                '08. previous close': '2043.21',
                '09. change': '24.13',
                '10. change percent': '1.1810%'
              }
            }
          ];
          
          console.log('Successfully generated mock indices data');
          
          // Return the mock data
          return new Response(JSON.stringify({ indices: mockIndices }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Error generating mock indices data:', error);
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
    
    // Added more debugging to help identify issues
    console.log('API Response received, response type:', typeof data);
    console.log('First few keys in response:', Object.keys(data).slice(0, 5));
    
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

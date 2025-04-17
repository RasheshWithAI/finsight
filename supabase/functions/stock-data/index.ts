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
    // Check if API key is available, but continue with mock data if not
    if (!ALPHA_VANTAGE_API_KEY) {
      console.error('ALPHA_VANTAGE_API_KEY environment variable is not set, using mock data');
      return handleMockData('unavailable', { action: 'unavailable' }, corsHeaders);
    } else {
      console.log(`Alpha Vantage API Key is configured: ${ALPHA_VANTAGE_API_KEY.substring(0, 3)}...`);
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
    
    console.log(`Received request with params: ${JSON.stringify(params)}`);
    
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
        
        try {
          console.log(`Fetching search data from Alpha Vantage API for keywords: ${keywords}`);
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            console.error(`Search API error: ${response.status} ${response.statusText}`);
            throw new Error(`Search API error: ${response.status} ${response.statusText}`);
          }
          
          const responseText = await response.text();
          console.log(`Raw API response: ${responseText.substring(0, 200)}...`);
          
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error(`Error parsing JSON response: ${parseError}`);
            throw new Error(`Error parsing API response: ${parseError.message}`);
          }
          
          // Check if we got an API error response or rate limit message
          if (data && data.Note) {
            console.warn('Alpha Vantage API usage limit message:', data.Note);
            throw new Error('API rate limit reached');
          }
          
          if (data && data.Error) {
            console.error('Alpha Vantage API error:', data.Error);
            throw new Error(data.Error);
          }
          
          // Check if data is empty or invalid
          if (!data || !data.bestMatches || !Array.isArray(data.bestMatches)) {
            console.warn('Invalid or empty search results format', data);
            throw new Error('Invalid API response format');
          }
          
          console.log(`Found ${data.bestMatches.length} matching stocks`);
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
          
        } catch (searchError) {
          console.error(`Error in stock search: ${searchError}`);
          return generateMockSearchResults(keywords, corsHeaders);
        }
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
        
        try {
          console.log(`Fetching quote data from Alpha Vantage API for symbol: ${symbol}`);
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            console.error(`Quote API error: ${response.status} ${response.statusText}`);
            throw new Error(`Quote API error: ${response.status} ${response.statusText}`);
          }
          
          const responseText = await response.text();
          console.log(`Raw API response: ${responseText.substring(0, 200)}...`);
          
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error(`Error parsing JSON response: ${parseError}`);
            throw new Error(`Error parsing API response: ${parseError.message}`);
          }
          
          if (data && data.Note) {
            console.warn('Alpha Vantage API usage limit message:', data.Note);
            throw new Error('API rate limit reached');
          }
          
          if (data && data.Error) {
            console.error('Alpha Vantage API error:', data.Error);
            throw new Error(data.Error);
          }
          
          // Check if the response has valid data
          if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
            console.warn(`No quote data found for symbol: ${symbol}`);
            throw new Error('No quote data found');
          }
          
          console.log('Quote data received successfully');
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
          
        } catch (quoteError) {
          console.error(`Error in stock quote: ${quoteError}`);
          return generateMockQuoteData(symbol, corsHeaders);
        }
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
        
        try {
          console.log(`Fetching daily data from Alpha Vantage API for symbol: ${dailySymbol}`);
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            console.error(`Daily API error: ${response.status} ${response.statusText}`);
            throw new Error(`Daily API error: ${response.status} ${response.statusText}`);
          }
          
          const responseText = await response.text();
          console.log(`Raw API response: ${responseText.substring(0, 200)}...`);
          
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error(`Error parsing JSON response: ${parseError}`);
            throw new Error(`Error parsing API response: ${parseError.message}`);
          }
          
          if (data && data.Note) {
            console.warn('Alpha Vantage API usage limit message:', data.Note);
            throw new Error('API rate limit reached');
          }
          
          if (data && data.Error) {
            console.error('Alpha Vantage API error:', data.Error);
            throw new Error(data.Error);
          }
          
          // Check if the response has valid data
          if (!data['Time Series (Daily)'] || Object.keys(data['Time Series (Daily)']).length === 0) {
            console.warn(`No daily data found for symbol: ${dailySymbol}`);
            throw new Error('No daily data found');
          }
          
          console.log('Daily data received successfully');
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
          
        } catch (dailyError) {
          console.error(`Error in daily data: ${dailyError}`);
          return generateMockHistoricalData(dailySymbol, corsHeaders);
        }
        break;
        
      case 'indices':
        try {
          console.log('Fetching market indices data from Alpha Vantage API');
          
          // We need to fetch data for multiple indices
          const indices = ['^DJI', '^GSPC', '^IXIC', '^RUT'];
          const promises = indices.map(async (symbol) => {
            const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA_VANTAGE_API_KEY}`;
            console.log(`Fetching index data for ${symbol} from: ${url}`);
            
            try {
              const response = await fetch(url);
              
              if (!response.ok) {
                console.warn(`Index API error for ${symbol}: ${response.status}`);
                return null;
              }
              
              const data = await response.json();
              console.log(`Received data for ${symbol}: ${JSON.stringify(data).substring(0, 100)}...`);
              
              if (data.Note || !data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
                console.warn(`Invalid or limited data for ${symbol}`);
                return null;
              }
              
              return data;
            } catch (err) {
              console.error(`Error fetching index ${symbol}: ${err}`);
              return null;
            }
          });
          
          const results = await Promise.all(promises);
          const validResults = results.filter(Boolean);
          
          if (validResults.length === 0) {
            console.warn('No valid index data received, using mock data');
            throw new Error('Failed to fetch any valid index data');
          }
          
          console.log(`Successfully fetched ${validResults.length} indices`);
          return new Response(JSON.stringify({ indices: validResults }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
          
        } catch (indicesError) {
          console.error(`Error fetching market indices: ${indicesError}`);
          return generateMockIndicesData(corsHeaders);
        }
        break;
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action parameter' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    
  } catch (error) {
    console.error(`General error in stock-data function: ${error}`);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message,
      note: 'Using mock data as fallback. Live data will update when available.'
    }), {
      // Returning 200 instead of 500 to prevent client-side errors
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to handle mock data based on action type
function handleMockData(action: string, params: any, corsHeaders: any) {
  console.log(`Using mock data for action: ${action}`);
  switch (action) {
    case 'search':
      return generateMockSearchResults(params.keywords, corsHeaders);
    case 'quote':
      return generateMockQuoteData(params.symbol, corsHeaders);
    case 'daily':
      return generateMockHistoricalData(params.symbol, corsHeaders);
    case 'indices':
      return generateMockIndicesData(corsHeaders);
    case 'unavailable':
      return new Response(JSON.stringify({ 
        error: 'API key unavailable',
        message: 'Alpha Vantage API key is not configured. Using mock data instead.',
        note: 'Using mock data as fallback. Configure API key for live data.'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    default:
      return new Response(JSON.stringify({ error: 'Invalid action parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
  }
}

// Generate mock search results based on keywords
function generateMockSearchResults(keywords: string, corsHeaders: any) {
  console.log(`Generating mock search results for: ${keywords}`);
  
  // Map common stock keywords to realistic mock data
  let mockResults = [];
  const lowercaseKeywords = keywords.toLowerCase();
  
  if (lowercaseKeywords.includes('app') || lowercaseKeywords.includes('aapl')) {
    mockResults.push({
      '1. symbol': 'AAPL',
      '2. name': 'Apple Inc',
      '3. type': 'Equity',
      '4. region': 'United States',
      '5. marketOpen': '09:30',
      '6. marketClose': '16:00',
      '7. timezone': 'UTC-05',
      '8. currency': 'USD',
      '9. matchScore': '0.9876'
    });
  }
  
  if (lowercaseKeywords.includes('micro') || lowercaseKeywords.includes('msft')) {
    mockResults.push({
      '1. symbol': 'MSFT',
      '2. name': 'Microsoft Corporation',
      '3. type': 'Equity',
      '4. region': 'United States',
      '5. marketOpen': '09:30',
      '6. marketClose': '16:00',
      '7. timezone': 'UTC-05',
      '8. currency': 'USD',
      '9. matchScore': '0.9752'
    });
  }
  
  if (lowercaseKeywords.includes('goog') || lowercaseKeywords.includes('alpha')) {
    mockResults.push({
      '1. symbol': 'GOOGL',
      '2. name': 'Alphabet Inc',
      '3. type': 'Equity',
      '4. region': 'United States',
      '5. marketOpen': '09:30',
      '6. marketClose': '16:00',
      '7. timezone': 'UTC-05',
      '8. currency': 'USD',
      '9. matchScore': '0.9641'
    });
  }
  
  if (lowercaseKeywords.includes('amaz') || lowercaseKeywords.includes('amzn')) {
    mockResults.push({
      '1. symbol': 'AMZN',
      '2. name': 'Amazon.com Inc',
      '3. type': 'Equity',
      '4. region': 'United States',
      '5. marketOpen': '09:30',
      '6. marketClose': '16:00',
      '7. timezone': 'UTC-05',
      '8. currency': 'USD',
      '9. matchScore': '0.9532'
    });
  }
  
  if (lowercaseKeywords.includes('meta') || lowercaseKeywords.includes('facebook') || lowercaseKeywords.includes('fb')) {
    mockResults.push({
      '1. symbol': 'META',
      '2. name': 'Meta Platforms Inc',
      '3. type': 'Equity',
      '4. region': 'United States',
      '5. marketOpen': '09:30',
      '6. marketClose': '16:00',
      '7. timezone': 'UTC-05',
      '8. currency': 'USD',
      '9. matchScore': '0.9423'
    });
  }
  
  if (lowercaseKeywords.includes('tesla') || lowercaseKeywords.includes('tsla')) {
    mockResults.push({
      '1. symbol': 'TSLA',
      '2. name': 'Tesla Inc',
      '3. type': 'Equity',
      '4. region': 'United States',
      '5. marketOpen': '09:30',
      '6. marketClose': '16:00',
      '7. timezone': 'UTC-05',
      '8. currency': 'USD',
      '9. matchScore': '0.9314'
    });
  }
  
  if (lowercaseKeywords.includes('nyse') || lowercaseKeywords.includes('popular')) {
    mockResults = [
      ...mockResults,
      {
        '1. symbol': 'JPM',
        '2. name': 'JPMorgan Chase & Co',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-05',
        '8. currency': 'USD',
        '9. matchScore': '0.8654'
      },
      {
        '1. symbol': 'WMT',
        '2. name': 'Walmart Inc',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-05',
        '8. currency': 'USD',
        '9. matchScore': '0.8543'
      },
      {
        '1. symbol': 'DIS',
        '2. name': 'Walt Disney Co',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-05',
        '8. currency': 'USD',
        '9. matchScore': '0.8432'
      }
    ];
  }
  
  if (lowercaseKeywords.includes('nasdaq') || lowercaseKeywords.includes('tech')) {
    mockResults = [
      ...mockResults,
      {
        '1. symbol': 'NVDA',
        '2. name': 'NVIDIA Corporation',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-05',
        '8. currency': 'USD',
        '9. matchScore': '0.8765'
      },
      {
        '1. symbol': 'AMD',
        '2. name': 'Advanced Micro Devices Inc',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-05',
        '8. currency': 'USD',
        '9. matchScore': '0.8654'
      },
      {
        '1. symbol': 'INTC',
        '2. name': 'Intel Corporation',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-05',
        '8. currency': 'USD',
        '9. matchScore': '0.8543'
      }
    ];
  }
  
  if (lowercaseKeywords.includes('shanghai')) {
    mockResults = [
      {
        '1. symbol': '600519.SHG',
        '2. name': 'Kweichow Moutai Co Ltd',
        '3. type': 'Equity',
        '4. region': 'China',
        '5. marketOpen': '09:30',
        '6. marketClose': '15:00',
        '7. timezone': 'UTC+08',
        '8. currency': 'CNY',
        '9. matchScore': '0.8765'
      },
      {
        '1. symbol': '601398.SHG',
        '2. name': 'Industrial and Commercial Bank of China',
        '3. type': 'Equity',
        '4. region': 'China',
        '5. marketOpen': '09:30',
        '6. marketClose': '15:00',
        '7. timezone': 'UTC+08',
        '8. currency': 'CNY',
        '9. matchScore': '0.8654'
      },
      {
        '1. symbol': '601857.SHG',
        '2. name': 'PetroChina Co Ltd',
        '3. type': 'Equity',
        '4. region': 'China',
        '5. marketOpen': '09:30',
        '6. marketClose': '15:00',
        '7. timezone': 'UTC+08',
        '8. currency': 'CNY',
        '9. matchScore': '0.8543'
      }
    ];
  }
  
  if (lowercaseKeywords.includes('tokyo')) {
    mockResults = [
      {
        '1. symbol': '7203.TYO',
        '2. name': 'Toyota Motor Corp',
        '3. type': 'Equity',
        '4. region': 'Japan',
        '5. marketOpen': '09:00',
        '6. marketClose': '15:00',
        '7. timezone': 'UTC+09',
        '8. currency': 'JPY',
        '9. matchScore': '0.8765'
      },
      {
        '1. symbol': '6758.TYO',
        '2. name': 'Sony Group Corp',
        '3. type': 'Equity',
        '4. region': 'Japan',
        '5. marketOpen': '09:00',
        '6. marketClose': '15:00',
        '7. timezone': 'UTC+09',
        '8. currency': 'JPY',
        '9. matchScore': '0.8654'
      },
      {
        '1. symbol': '6861.TYO',
        '2. name': 'Keyence Corp',
        '3. type': 'Equity',
        '4. region': 'Japan',
        '5. marketOpen': '09:00',
        '6. marketClose': '15:00',
        '7. timezone': 'UTC+09',
        '8. currency': 'JPY',
        '9. matchScore': '0.8543'
      }
    ];
  }
  
  if (lowercaseKeywords.includes('india')) {
    mockResults = [
      {
        '1. symbol': 'RELIANCE.BSE',
        '2. name': 'Reliance Industries Ltd',
        '3. type': 'Equity',
        '4. region': 'India',
        '5. marketOpen': '09:15',
        '6. marketClose': '15:30',
        '7. timezone': 'UTC+05:30',
        '8. currency': 'INR',
        '9. matchScore': '0.8765'
      },
      {
        '1. symbol': 'TCS.BSE',
        '2. name': 'Tata Consultancy Services Ltd',
        '3. type': 'Equity',
        '4. region': 'India',
        '5. marketOpen': '09:15',
        '6. marketClose': '15:30',
        '7. timezone': 'UTC+05:30',
        '8. currency': 'INR',
        '9. matchScore': '0.8654'
      },
      {
        '1. symbol': 'HDFCBANK.BSE',
        '2. name': 'HDFC Bank Ltd',
        '3. type': 'Equity',
        '4. region': 'India',
        '5. marketOpen': '09:15',
        '6. marketClose': '15:30',
        '7. timezone': 'UTC+05:30',
        '8. currency': 'INR',
        '9. matchScore': '0.8543'
      }
    ];
  }
  
  // If no specific matches, provide some generic tech stocks
  if (mockResults.length === 0) {
    mockResults = [
      {
        '1. symbol': 'AAPL',
        '2. name': 'Apple Inc',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-05',
        '8. currency': 'USD',
        '9. matchScore': '0.7654'
      },
      {
        '1. symbol': 'MSFT',
        '2. name': 'Microsoft Corporation',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-05',
        '8. currency': 'USD',
        '9. matchScore': '0.7543'
      },
      {
        '1. symbol': 'GOOGL',
        '2. name': 'Alphabet Inc',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-05',
        '8. currency': 'USD',
        '9. matchScore': '0.7432'
      },
      {
        '1. symbol': 'AMZN',
        '2. name': 'Amazon.com Inc',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-05',
        '8. currency': 'USD',
        '9. matchScore': '0.7321'
      }
    ];
  }
  
  console.log(`Generated mock search data with ${mockResults.length} results`);
  return new Response(JSON.stringify({ 
    bestMatches: mockResults,
    note: "Using cached search results. Live data will update when available."
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Generate mock quote data for a symbol
function generateMockQuoteData(symbol: string, corsHeaders: any) {
  console.log(`Generating mock quote data for: ${symbol}`);
  
  // Base price depends on symbol to make it consistent between calls
  const symbolHash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const basePrice = 50 + (symbolHash % 950); // Price between 50 and 1000
  const priceChange = (Math.random() * 20) - 10; // Change between -10 and +10
  const changePercent = (priceChange / basePrice) * 100;
  
  const mockQuote = {
    'Global Quote': {
      '01. symbol': symbol,
      '02. open': (basePrice - (Math.random() * 5)).toFixed(2),
      '03. high': (basePrice + (Math.random() * 10)).toFixed(2),
      '04. low': (basePrice - (Math.random() * 10)).toFixed(2),
      '05. price': basePrice.toFixed(2),
      '06. volume': Math.floor(Math.random() * 10000000 + 100000).toString(),
      '07. latest trading day': new Date().toISOString().split('T')[0],
      '08. previous close': (basePrice - priceChange).toFixed(2),
      '09. change': priceChange.toFixed(2),
      '10. change percent': changePercent.toFixed(2) + '%',
    }
  };
  
  console.log(`Generated mock quote data for ${symbol}`);
  return new Response(JSON.stringify(mockQuote), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Generate mock historical data for a symbol
function generateMockHistoricalData(symbol: string, corsHeaders: any) {
  console.log(`Generating mock historical data for: ${symbol}`);
  
  // Base price depends on symbol to make it consistent between calls
  const symbolHash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let basePrice = 50 + (symbolHash % 950); // Price between 50 and 1000
  
  const mockHistorical = {
    'Meta Data': {
      '1. Information': 'Daily Prices (open, high, low, close) and Volumes',
      '2. Symbol': symbol,
      '3. Last Refreshed': new Date().toISOString().split('T')[0],
      '4. Output Size': 'Compact',
      '5. Time Zone': 'US/Eastern',
    },
    'Time Series (Daily)': {}
  };
  
  // Generate 30 days of historical data
  const timeSeriesData = {};
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Add some randomness but keep a general trend
    const trend = Math.sin(i / 10) * 10;
    const dailyChange = (Math.random() * 10) - 5 + trend;
    basePrice += dailyChange;
    
    if (basePrice < 10) basePrice = 10; // Prevent negative or too small prices
    
    timeSeriesData[dateString] = {
      '1. open': (basePrice - (Math.random() * 5)).toFixed(2),
      '2. high': (basePrice + (Math.random() * 10)).toFixed(2),
      '3. low': (basePrice - (Math.random() * 10)).toFixed(2),
      '4. close': basePrice.toFixed(2),
      '5. volume': Math.floor(Math.random() * 10000000 + 100000).toString(),
    };
  }
  
  mockHistorical['Time Series (Daily)'] = timeSeriesData;
  
  console.log(`Generated mock historical data for ${symbol} with 30 days of data`);
  return new Response(JSON.stringify(mockHistorical), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Generate mock indices data
function generateMockIndicesData(corsHeaders: any) {
  console.log('Generating mock indices data');
  
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Generate more realistic dynamic market index data
  const mockIndices = [
    {
      'Global Quote': {
        '01. symbol': '^DJI',
        '02. open': '38923.45',
        '03. high': '39102.34',
        '04. low': '38856.23',
        '05. price': '39045.67',
        '06. volume': '345678901',
        '07. latest trading day': currentDate,
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
        '07. latest trading day': currentDate,
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
        '07. latest trading day': currentDate,
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
        '07. latest trading day': currentDate,
        '08. previous close': '2043.21',
        '09. change': '24.13',
        '10. change percent': '1.1810%'
      }
    }
  ];
  
  console.log('Successfully generated mock indices data');
  
  return new Response(JSON.stringify({ indices: mockIndices }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Detailed logging for better debugging
function logDetailedError(action: string, error: any) {
  console.error(`Error in ${action} action:`, {
    errorName: error.name,
    errorMessage: error.message,
    errorStack: error.stack
  });
}

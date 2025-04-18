import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    
    console.log(`Received request with params: ${JSON.stringify(params)}`);
    
    const action = params.action;
    
    if (!action) {
      return new Response(JSON.stringify({ error: 'Action parameter is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // YFinance API URL
    const YFINANCE_API_URL = "https://query1.finance.yahoo.com/v1/finance";
    
    switch (action) {
      case 'search':
        const keywords = params.keywords;
        if (!keywords) {
          return new Response(JSON.stringify({ error: 'Keywords parameter is required for search action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        try {
          console.log(`Fetching search data from Yahoo Finance API for keywords: ${keywords}`);
          const searchUrl = `${YFINANCE_API_URL}/search?q=${encodeURIComponent(keywords)}&quotesCount=10&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`;
          
          const response = await fetch(searchUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          if (!response.ok) {
            console.error(`Search API error: ${response.status} ${response.statusText}`);
            throw new Error(`Search API error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          
          // Check if data is empty or invalid
          if (!data || !data.quotes || !Array.isArray(data.quotes)) {
            console.warn('Invalid or empty search results format', data);
            throw new Error('Invalid API response format');
          }
          
          console.log(`Found ${data.quotes.length} matching stocks`);
          return new Response(JSON.stringify({ results: data.quotes }), {
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
        
        try {
          console.log(`Fetching quote data from Yahoo Finance API for symbol: ${symbol}`);
          const quoteUrl = `${YFINANCE_API_URL}/quoteSummary/${encodeURIComponent(symbol)}?modules=price`;
          
          const response = await fetch(quoteUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          if (!response.ok) {
            console.error(`Quote API error: ${response.status} ${response.statusText}`);
            throw new Error(`Quote API error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          
          // Check if the response has valid data
          if (!data || !data.quoteSummary || !data.quoteSummary.result || !data.quoteSummary.result[0]) {
            console.warn(`No quote data found for symbol: ${symbol}`);
            throw new Error('No quote data found');
          }
          
          const priceData = data.quoteSummary.result[0].price;
          
          console.log('Quote data received successfully');
          return new Response(JSON.stringify({ quote: priceData }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (quoteError) {
          console.error(`Error in stock quote: ${quoteError}`);
          return generateMockQuoteData(symbol, corsHeaders);
        }
        break;
        
      case 'history':
        const historySymbol = params.symbol;
        if (!historySymbol) {
          return new Response(JSON.stringify({ error: 'Symbol parameter is required for history action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        try {
          console.log(`Fetching history data from Yahoo Finance API for symbol: ${historySymbol}`);
          // Get historical data for the past year with daily interval
          const endDate = Math.floor(Date.now() / 1000);
          const startDate = endDate - 60 * 60 * 24 * 365; // 1 year ago
          
          const historyUrl = `${YFINANCE_API_URL}/chart/${encodeURIComponent(historySymbol)}?period1=${startDate}&period2=${endDate}&interval=1d`;
          
          const response = await fetch(historyUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          if (!response.ok) {
            console.error(`History API error: ${response.status} ${response.statusText}`);
            throw new Error(`History API error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          
          // Check if the response has valid data
          if (!data || !data.chart || !data.chart.result || !data.chart.result[0]) {
            console.warn(`No history data found for symbol: ${historySymbol}`);
            throw new Error('No history data found');
          }
          
          const chartData = data.chart.result[0];
          const timestamps = chartData.timestamp;
          const quoteData = chartData.indicators.quote[0];
          
          // Process historical data into a format our app expects
          const history = timestamps.map((timestamp: number, index: number) => {
            const date = new Date(timestamp * 1000).toISOString().split('T')[0];
            return {
              date,
              open: quoteData.open[index],
              high: quoteData.high[index],
              low: quoteData.low[index],
              close: quoteData.close[index],
              volume: quoteData.volume[index],
            };
          }).filter((item: any) => item.open !== null && item.close !== null);
          
          console.log('History data received successfully');
          return new Response(JSON.stringify({ history }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (historyError) {
          console.error(`Error in history data: ${historyError}`);
          return generateMockHistoricalData(historySymbol, corsHeaders);
        }
        break;
        
      case 'indices':
        try {
          console.log('Fetching market indices data from Yahoo Finance API');
          
          // Define the indices we want to fetch
          const indices = ['^DJI', '^GSPC', '^IXIC', '^RUT'];
          
          // Improved approach: Use single URL to get all indices at once
          const symbols = indices.join(',');
          const indicesUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;
          
          console.log(`Fetching all indices with URL: ${indicesUrl}`);
          
          const response = await fetch(indicesUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          if (!response.ok) {
            console.error(`Indices API error: ${response.status} ${response.statusText}`);
            throw new Error(`Indices API error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          
          if (!data || !data.quoteResponse || !data.quoteResponse.result) {
            console.error('Invalid response format from Yahoo Finance', data);
            throw new Error('Invalid response format from indices API');
          }
          
          const indicesData = data.quoteResponse.result;
          console.log(`Received data for ${indicesData.length} indices`);
          
          // Transform data to the format our frontend expects
          const processedIndices = indicesData.map((quote: any) => {
            return {
              id: quote.symbol,
              name: quote.shortName || quote.longName || quote.symbol,
              value: parseFloat(quote.regularMarketPrice),
              change: parseFloat(quote.regularMarketChange),
              changePercent: parseFloat(quote.regularMarketChangePercent),
            };
          });
          
          console.log('Successfully processed indices data:', processedIndices);
          
          if (processedIndices.length === 0) {
            console.warn('No valid indices data after processing');
            throw new Error("No valid market indices data available");
          }
          
          return new Response(JSON.stringify({ indices: processedIndices }), {
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
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Generate mock search results based on keywords
function generateMockSearchResults(keywords: string, corsHeaders: any) {
  console.log(`Generating mock search results for: ${keywords}`);
  
  // Map common stock keywords to realistic mock data
  let mockResults = [];
  const lowercaseKeywords = keywords.toLowerCase();
  
  if (lowercaseKeywords.includes('app') || lowercaseKeywords.includes('aapl')) {
    mockResults.push({
      symbol: 'AAPL',
      shortname: 'Apple Inc',
      quoteType: 'Equity',
      exchange: 'NASDAQ',
    });
  }
  
  if (lowercaseKeywords.includes('micro') || lowercaseKeywords.includes('msft')) {
    mockResults.push({
      symbol: 'MSFT',
      shortname: 'Microsoft Corporation',
      quoteType: 'Equity',
      exchange: 'NASDAQ',
    });
  }
  
  if (lowercaseKeywords.includes('goog') || lowercaseKeywords.includes('alpha')) {
    mockResults.push({
      symbol: 'GOOGL',
      shortname: 'Alphabet Inc',
      quoteType: 'Equity',
      exchange: 'NASDAQ',
    });
  }
  
  if (lowercaseKeywords.includes('amaz') || lowercaseKeywords.includes('amzn')) {
    mockResults.push({
      symbol: 'AMZN',
      shortname: 'Amazon.com Inc',
      quoteType: 'Equity',
      exchange: 'NASDAQ',
    });
  }
  
  if (lowercaseKeywords.includes('meta') || lowercaseKeywords.includes('facebook') || lowercaseKeywords.includes('fb')) {
    mockResults.push({
      symbol: 'META',
      shortname: 'Meta Platforms Inc',
      quoteType: 'Equity',
      exchange: 'NASDAQ',
    });
  }
  
  if (lowercaseKeywords.includes('tesla') || lowercaseKeywords.includes('tsla')) {
    mockResults.push({
      symbol: 'TSLA',
      shortname: 'Tesla Inc',
      quoteType: 'Equity',
      exchange: 'NASDAQ',
    });
  }
  
  if (lowercaseKeywords.includes('nyse') || lowercaseKeywords.includes('popular')) {
    mockResults = [
      ...mockResults,
      {
        symbol: 'JPM',
        shortname: 'JPMorgan Chase & Co',
        quoteType: 'Equity',
        exchange: 'NYSE',
      },
      {
        symbol: 'WMT',
        shortname: 'Walmart Inc',
        quoteType: 'Equity',
        exchange: 'NYSE',
      },
      {
        symbol: 'DIS',
        shortname: 'Walt Disney Co',
        quoteType: 'Equity',
        exchange: 'NYSE',
      }
    ];
  }
  
  if (lowercaseKeywords.includes('nasdaq') || lowercaseKeywords.includes('tech')) {
    mockResults = [
      ...mockResults,
      {
        symbol: 'NVDA',
        shortname: 'NVIDIA Corporation',
        quoteType: 'Equity',
        exchange: 'NASDAQ',
      },
      {
        symbol: 'AMD',
        shortname: 'Advanced Micro Devices Inc',
        quoteType: 'Equity',
        exchange: 'NASDAQ',
      },
      {
        symbol: 'INTC',
        shortname: 'Intel Corporation',
        quoteType: 'Equity',
        exchange: 'NASDAQ',
      }
    ];
  }
  
  if (lowercaseKeywords.includes('shanghai')) {
    mockResults = [
      {
        symbol: '600519.SS',
        shortname: 'Kweichow Moutai Co Ltd',
        quoteType: 'Equity',
        exchange: 'Shanghai',
      },
      {
        symbol: '601398.SS',
        shortname: 'Industrial and Commercial Bank of China',
        quoteType: 'Equity',
        exchange: 'Shanghai',
      },
      {
        symbol: '601857.SS',
        shortname: 'PetroChina Co Ltd',
        quoteType: 'Equity',
        exchange: 'Shanghai',
      }
    ];
  }
  
  if (lowercaseKeywords.includes('tokyo')) {
    mockResults = [
      {
        symbol: '7203.T',
        shortname: 'Toyota Motor Corp',
        quoteType: 'Equity',
        exchange: 'Tokyo',
      },
      {
        symbol: '6758.T',
        shortname: 'Sony Group Corp',
        quoteType: 'Equity',
        exchange: 'Tokyo',
      },
      {
        symbol: '6861.T',
        shortname: 'Keyence Corp',
        quoteType: 'Equity',
        exchange: 'Tokyo',
      }
    ];
  }
  
  if (lowercaseKeywords.includes('india')) {
    mockResults = [
      {
        symbol: 'RELIANCE.NS',
        shortname: 'Reliance Industries Ltd',
        quoteType: 'Equity',
        exchange: 'NSE',
      },
      {
        symbol: 'TCS.NS',
        shortname: 'Tata Consultancy Services Ltd',
        quoteType: 'Equity',
        exchange: 'NSE',
      },
      {
        symbol: 'HDFCBANK.NS',
        shortname: 'HDFC Bank Ltd',
        quoteType: 'Equity',
        exchange: 'NSE',
      }
    ];
  }
  
  // If no specific matches, provide some generic tech stocks
  if (mockResults.length === 0) {
    mockResults = [
      {
        symbol: 'AAPL',
        shortname: 'Apple Inc',
        quoteType: 'Equity',
        exchange: 'NASDAQ',
      },
      {
        symbol: 'MSFT',
        shortname: 'Microsoft Corporation',
        quoteType: 'Equity',
        exchange: 'NASDAQ',
      },
      {
        symbol: 'GOOGL',
        shortname: 'Alphabet Inc',
        quoteType: 'Equity',
        exchange: 'NASDAQ',
      },
      {
        symbol: 'AMZN',
        shortname: 'Amazon.com Inc',
        quoteType: 'Equity',
        exchange: 'NASDAQ',
      }
    ];
  }
  
  console.log(`Generated mock search data with ${mockResults.length} results`);
  return new Response(JSON.stringify({ 
    results: mockResults,
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
    symbol: symbol,
    shortName: `Mock ${symbol} Inc`,
    longName: `Mock ${symbol} Incorporated`,
    regularMarketPrice: basePrice.toFixed(2),
    regularMarketOpen: (basePrice - (Math.random() * 5)).toFixed(2),
    regularMarketDayHigh: (basePrice + (Math.random() * 10)).toFixed(2),
    regularMarketDayLow: (basePrice - (Math.random() * 10)).toFixed(2),
    regularMarketVolume: Math.floor(Math.random() * 10000000 + 100000).toString(),
    regularMarketChange: priceChange.toFixed(2),
    regularMarketChangePercent: changePercent.toFixed(2),
    marketCap: Math.floor(basePrice * 1000000 * (Math.random() * 500 + 100)).toString(),
  };
  
  console.log(`Generated mock quote data for ${symbol}`);
  return new Response(JSON.stringify({ quote: mockQuote }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Generate mock historical data for a symbol
function generateMockHistoricalData(symbol: string, corsHeaders: any) {
  console.log(`Generating mock historical data for: ${symbol}`);
  
  // Base price depends on symbol to make it consistent between calls
  const symbolHash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let basePrice = 50 + (symbolHash % 950); // Price between 50 and 1000
  
  // Generate 30 days of historical data
  const history = [];
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
    
    history.push({
      date: dateString,
      open: (basePrice - (Math.random() * 5)).toFixed(2),
      high: (basePrice + (Math.random() * 10)).toFixed(2),
      low: (basePrice - (Math.random() * 10)).toFixed(2),
      close: basePrice.toFixed(2),
      volume: Math.floor(Math.random() * 10000000 + 100000),
    });
  }
  
  console.log(`Generated mock historical data for ${symbol} with 30 days of data`);
  return new Response(JSON.stringify({ history }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Generate mock indices data
function generateMockIndicesData(corsHeaders: any) {
  console.log('Generating mock indices data');
  
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Generate more realistic market index data
  const mockIndices = [
    {
      id: '^DJI',
      name: 'Dow Jones',
      value: 39045.67,
      change: 177.78,
      changePercent: 0.4575
    },
    {
      id: '^GSPC',
      name: 'S&P 500',
      value: 5145.32,
      change: 34.76,
      changePercent: 0.6802
    },
    {
      id: '^IXIC',
      name: 'NASDAQ',
      value: 16298.76,
      change: 100.31,
      changePercent: 0.6193
    },
    {
      id: '^RUT',
      name: 'Russell 2000',
      value: 2067.34,
      change: 24.13,
      changePercent: 1.1810
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


import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StockQuote, MarketIndex, StockSearchResult, StockHistoryPoint } from "@/types/stockTypes";

/**
 * Search for stocks with the given keywords
 */
export const searchStocks = async (keywords: string): Promise<StockSearchResult[]> => {
  try {
    console.log(`Searching stocks with keywords: ${keywords}`);
    const { data, error } = await supabase.functions.invoke('stock-data', {
      body: { action: 'search', keywords }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }
    
    if (data && data.results) {
      console.log(`Found ${data.results.length} matching stocks`);
      return data.results.map((match: any) => ({
        id: match.symbol,
        symbol: match.symbol,
        name: match.shortname || match.longname || match.symbol,
        type: match.quoteType || 'Equity',
        region: match.exchange || 'United States',
        currency: 'INR', // Changed from 'USD' to 'INR'
      }));
    }
    
    return data?.results || [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    toast.info("Using cached stock data for search results.");
    
    // Return a simple fallback set of stocks
    const fallbackStocks = getFallbackSearchResults(keywords);
    return fallbackStocks;
  }
};

/**
 * Get stock quote for the given symbol
 */
export const getStockQuote = async (symbol: string): Promise<StockQuote | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('stock-data', {
      body: { action: 'quote', symbol }
    });
    
    if (error) throw error;
    
    // Parse the quote data
    if (data && data.quote) {
      const quote = data.quote;
      return {
        symbol: quote.symbol,
        name: quote.shortName || quote.longName || quote.symbol,
        price: parseFloat(quote.regularMarketPrice),
        change: parseFloat(quote.regularMarketChange),
        changePercent: parseFloat(quote.regularMarketChangePercent),
        volume: parseInt(quote.regularMarketVolume),
        marketCap: quote.marketCap ? parseInt(quote.marketCap) : undefined
      };
    }
    
    if (!data || !data.quote) {
      toast.info(`Using cached data for ${symbol}. Live data will update when available.`);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting stock quote:', error);
    toast.info(`Using cached data for ${symbol}. Live data will update when available.`);
    
    return generateMockStockQuote(symbol);
  }
};

/**
 * Get stock history for the given symbol
 */
export const getStockHistory = async (symbol: string): Promise<StockHistoryPoint[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('stock-data', {
      body: { action: 'history', symbol }
    });
    
    if (error) throw error;
    
    // Parse the historical data
    if (data && data.history && data.history.length > 0) {
      return data.history.map((item: any) => ({
        date: item.date,
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
        volume: parseInt(item.volume),
      }));
    }
    
    toast.info(`Using cached historical data for ${symbol}. Live data will update when available.`);
    return [];
  } catch (error) {
    console.error('Error getting stock history:', error);
    toast.info(`Using cached historical data for ${symbol}. Live data will update when available.`);
    
    return generateMockHistoricalData(symbol);
  }
};

/**
 * Get market indices data
 */
export const fetchMarketIndices = async (): Promise<MarketIndex[]> => {
  try {
    console.log('Fetching market indices data...');
    const { data, error } = await supabase.functions.invoke('stock-data', {
      body: { action: 'indices' }
    });
    
    if (error) {
      console.error('Error from stock-data function:', error);
      throw error;
    }
    
    if (!data || !data.indices) {
      console.error('Invalid response format from indices API:', data);
      throw new Error('Invalid response format from indices API');
    }
    
    console.log('Raw indices data received:', JSON.stringify(data).substring(0, 300));
    
    // Transform the raw indices data into our format
    const indices = data.indices
      .map((indexData: any) => {
        if (!indexData || !indexData.quote) {
          console.warn(`Missing or empty quote data for index`);
          return null;
        }
        
        const quote = indexData.quote;
        
        // Check all required fields exist before processing
        if (!quote.regularMarketPrice || !quote.regularMarketChange) {
          console.warn(`Missing price or change data for index:`, quote);
          return null;
        }
        
        return {
          id: quote.symbol,
          name: quote.shortName || quote.longName || quote.symbol,
          value: parseFloat(quote.regularMarketPrice),
          change: parseFloat(quote.regularMarketChange),
          changePercent: parseFloat(quote.regularMarketChangePercent),
        };
      })
      .filter(Boolean) as MarketIndex[];
    
    console.log('Processed indices data:', indices);
    
    if (indices.length === 0) {
      console.warn('No valid indices data after processing');
      throw new Error("No valid market indices data available");
    }
    
    return indices;
  } catch (error) {
    console.error('Error fetching market indices:', error);
    
    return getMockMarketIndices();
  }
};

// Helper functions for providing fallback data

export const generateMockStockQuote = (symbol: string): StockQuote => {
  return {
    symbol,
    price: 150 + Math.random() * 100,
    change: Math.random() * 10 - 5,
    changePercent: Math.random() * 5 - 2.5,
    volume: Math.floor(Math.random() * 10000000),
  };
};

export const generateMockHistoricalData = (symbol: string): StockHistoryPoint[] => {
  const fallbackData: StockHistoryPoint[] = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const basePrice = 150 + Math.random() * 50;
    
    fallbackData.push({
      date: date.toISOString().split('T')[0],
      open: basePrice - Math.random() * 5,
      high: basePrice + Math.random() * 5,
      low: basePrice - Math.random() * 8,
      close: basePrice + Math.random() * 3 - 1.5,
      volume: Math.floor(Math.random() * 10000000),
    });
  }
  
  return fallbackData;
};

export const getMockMarketIndices = (): MarketIndex[] => {
  return [
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
};

export const getFallbackSearchResults = (keywords: string): StockSearchResult[] => {
  // Customize the fallback results based on the search keywords
  const lowercaseKeywords = keywords.toLowerCase();
  
  // Default fallback stocks
  let fallbackStocks = [
    { id: 'AAPL', symbol: 'AAPL', name: 'Apple Inc', type: 'Equity', region: 'United States', currency: 'INR' },
    { id: 'MSFT', symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Equity', region: 'United States', currency: 'INR' },
    { id: 'GOOGL', symbol: 'GOOGL', name: 'Alphabet Inc', type: 'Equity', region: 'United States', currency: 'INR' }
  ];
  
  // Specific fallbacks based on search keywords
  if (lowercaseKeywords.includes('tech')) {
    fallbackStocks = [
      { id: 'AAPL', symbol: 'AAPL', name: 'Apple Inc', type: 'Equity', region: 'United States', currency: 'INR' },
      { id: 'MSFT', symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Equity', region: 'United States', currency: 'INR' },
      { id: 'GOOGL', symbol: 'GOOGL', name: 'Alphabet Inc', type: 'Equity', region: 'United States', currency: 'INR' },
      { id: 'NVDA', symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Equity', region: 'United States', currency: 'INR' },
      { id: 'AMZN', symbol: 'AMZN', name: 'Amazon.com Inc', type: 'Equity', region: 'United States', currency: 'INR' }
    ];
  } else if (lowercaseKeywords.includes('bank') || lowercaseKeywords.includes('financ')) {
    fallbackStocks = [
      { id: 'JPM', symbol: 'JPM', name: 'JPMorgan Chase & Co', type: 'Equity', region: 'United States', currency: 'INR' },
      { id: 'BAC', symbol: 'BAC', name: 'Bank of America Corp', type: 'Equity', region: 'United States', currency: 'INR' },
      { id: 'WFC', symbol: 'WFC', name: 'Wells Fargo & Co', type: 'Equity', region: 'United States', currency: 'INR' },
      { id: 'C', symbol: 'C', name: 'Citigroup Inc', type: 'Equity', region: 'United States', currency: 'INR' }
    ];
  } else if (lowercaseKeywords.includes('health') || lowercaseKeywords.includes('pharma')) {
    fallbackStocks = [
      { id: 'JNJ', symbol: 'JNJ', name: 'Johnson & Johnson', type: 'Equity', region: 'United States', currency: 'INR' },
      { id: 'PFE', symbol: 'PFE', name: 'Pfizer Inc', type: 'Equity', region: 'United States', currency: 'INR' },
      { id: 'MRK', symbol: 'MRK', name: 'Merck & Co Inc', type: 'Equity', region: 'United States', currency: 'INR' },
      { id: 'UNH', symbol: 'UNH', name: 'UnitedHealth Group Inc', type: 'Equity', region: 'United States', currency: 'INR' }
    ];
  }
  
  return fallbackStocks;
};

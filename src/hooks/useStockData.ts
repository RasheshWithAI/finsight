
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export type StockQuote = {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  volume: number;
};

export type MarketIndex = {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
};

export const useStockData = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const searchStocks = async (keywords: string): Promise<any[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stock-data', {
        query: { action: 'search', keywords }
      });
      
      if (error) throw error;
      
      // Parse the search results and return in our app format
      if (data && data.bestMatches) {
        return data.bestMatches.map((match: any) => ({
          id: match['1. symbol'],
          symbol: match['1. symbol'],
          name: match['2. name'],
          type: match['3. type'],
          region: match['4. region'],
          marketOpen: match['5. marketOpen'],
          marketClose: match['6. marketClose'],
          timezone: match['7. timezone'],
          currency: match['8. currency'],
        }));
      }
      return [];
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStockQuote = async (symbol: string): Promise<StockQuote | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('stock-data', {
        query: { action: 'quote', symbol }
      });
      
      if (error) throw error;
      
      // Parse the quote data
      if (data && data['Global Quote']) {
        const quote = data['Global Quote'];
        return {
          symbol: quote['01. symbol'],
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting stock quote:', error);
      return null;
    }
  };
  
  const getStockHistory = async (symbol: string): Promise<any[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('stock-data', {
        query: { action: 'daily', symbol }
      });
      
      if (error) throw error;
      
      // Parse the historical data
      if (data && data['Time Series (Daily)']) {
        const timeSeriesDaily = data['Time Series (Daily)'];
        return Object.entries(timeSeriesDaily).map(([date, values]: [string, any]) => ({
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting stock history:', error);
      return [];
    }
  };
  
  const { data: marketIndices, refetch: refetchMarketIndices } = useQuery({
    queryKey: ['marketIndices'],
    queryFn: async (): Promise<MarketIndex[]> => {
      try {
        const { data, error } = await supabase.functions.invoke('stock-data', {
          query: { action: 'indices' }
        });
        
        if (error) throw error;
        
        if (data && data.indices) {
          // Transform the raw indices data into our format
          const indices = data.indices.map((indexData: any, i: number) => {
            const quote = indexData['Global Quote'];
            if (!quote) return null;
            
            const names = ['Dow Jones', 'S&P 500', 'NASDAQ', 'Russell 2000'];
            const ids = ['DJI', 'SPX', 'IXIC', 'RUT'];
            
            return {
              id: ids[i],
              name: names[i],
              value: parseFloat(quote['05. price']),
              change: parseFloat(quote['09. change']),
              changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            };
          }).filter(Boolean);
          
          return indices;
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching market indices:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
  
  return {
    searchStocks,
    getStockQuote,
    getStockHistory,
    marketIndices,
    refetchMarketIndices,
    isLoading
  };
};

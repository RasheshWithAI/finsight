import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StockQuote, MarketIndex, StockSearchResult, StockHistoryPoint } from '@/types/stockTypes';
import { 
  searchStocks as apiSearchStocks, 
  getStockQuote as apiGetStockQuote, 
  getStockHistory as apiGetStockHistory,
  fetchMarketIndices
} from '@/services/stockApiService';
import { toast } from 'sonner';

export type { StockQuote, MarketIndex, StockSearchResult, StockHistoryPoint };

export const useStockData = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const searchStocks = async (keywords: string): Promise<StockSearchResult[]> => {
    setIsLoading(true);
    try {
      console.log(`Searching stocks with keywords: ${keywords}`);
      const results = await apiSearchStocks(keywords);
      return results;
    } catch (error) {
      console.error('Error searching stocks:', error);
      toast.error('Failed to search stocks. Using fallback data.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStockQuote = async (symbol: string): Promise<StockQuote | null> => {
    try {
      console.log(`Fetching stock quote for: ${symbol}`);
      const quote = await apiGetStockQuote(symbol);
      return quote;
    } catch (error) {
      console.error('Error getting stock quote:', error);
      toast.error(`Failed to get quote for ${symbol}. Using fallback data.`);
      throw error;
    }
  };
  
  const getStockHistory = async (symbol: string): Promise<StockHistoryPoint[]> => {
    try {
      console.log(`Fetching stock history for: ${symbol}`);
      const history = await apiGetStockHistory(symbol);
      return history;
    } catch (error) {
      console.error('Error getting stock history:', error);
      toast.error(`Failed to get history for ${symbol}. Using fallback data.`);
      throw error;
    }
  };
  
  const { 
    data: marketIndices, 
    refetch: refetchMarketIndices,
    isLoading: isIndicesLoading,
    isError: isIndicesError
  } = useQuery({
    queryKey: ['marketIndices'],
    queryFn: fetchMarketIndices,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching market indices:', error);
        toast.error('Failed to fetch market indices. Using cached data.');
      }
    }
  });
  
  return {
    searchStocks,
    getStockQuote,
    getStockHistory,
    marketIndices,
    refetchMarketIndices,
    isLoading: isLoading || isIndicesLoading,
    isError: isIndicesError
  };
};

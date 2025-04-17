
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StockQuote, MarketIndex, StockSearchResult, StockHistoryPoint } from '@/types/stockTypes';
import { 
  searchStocks as apiSearchStocks, 
  getStockQuote as apiGetStockQuote, 
  getStockHistory as apiGetStockHistory,
  fetchMarketIndices
} from '@/services/stockApiService';

export type { StockQuote, MarketIndex, StockSearchResult, StockHistoryPoint };

export const useStockData = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const searchStocks = async (keywords: string): Promise<StockSearchResult[]> => {
    setIsLoading(true);
    try {
      return await apiSearchStocks(keywords);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStockQuote = async (symbol: string): Promise<StockQuote | null> => {
    return apiGetStockQuote(symbol);
  };
  
  const getStockHistory = async (symbol: string): Promise<StockHistoryPoint[]> => {
    return apiGetStockHistory(symbol);
  };
  
  const { data: marketIndices, refetch: refetchMarketIndices } = useQuery({
    queryKey: ['marketIndices'],
    queryFn: fetchMarketIndices,
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

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
import { useExchangeRate, convertUsdToInr } from '@/utils/currencyUtils';

export type { StockQuote, MarketIndex, StockSearchResult, StockHistoryPoint };

export const useStockData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { rate: exchangeRate, isLoading: isExchangeRateLoading } = useExchangeRate();
  
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
      
      // Convert USD prices to INR
      if (quote) {
        return {
          ...quote,
          price: convertUsdToInr(quote.price, exchangeRate),
          change: convertUsdToInr(quote.change, exchangeRate),
          marketCap: quote.marketCap ? convertUsdToInr(quote.marketCap, exchangeRate) : undefined,
          // Note: changePercent is a percentage and should not be converted
        };
      }
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
      
      // Convert all USD prices to INR
      return history.map(point => ({
        ...point,
        open: convertUsdToInr(point.open, exchangeRate),
        high: convertUsdToInr(point.high, exchangeRate),
        low: convertUsdToInr(point.low, exchangeRate),
        close: convertUsdToInr(point.close, exchangeRate),
        // Volume remains unchanged
      }));
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
    queryFn: async () => {
      const indices = await fetchMarketIndices();
      
      // Convert USD values to INR
      return indices.map(index => ({
        ...index,
        value: convertUsdToInr(index.value, exchangeRate),
        change: convertUsdToInr(index.change, exchangeRate),
        // Note: changePercent is a percentage and should not be converted
      }));
    },
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
    exchangeRate,
    isLoading: isLoading || isIndicesLoading || isExchangeRateLoading,
    isError: isIndicesError
  };
};

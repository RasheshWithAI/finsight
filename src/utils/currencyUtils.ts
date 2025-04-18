
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Default exchange rate if API fails
const DEFAULT_USD_TO_INR_RATE = 83.50;

// Cache exchange rate and timestamp
let cachedExchangeRate: number | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Format currency based on the specified currency code
export const formatCurrency = (value: number, currencyCode: string = 'INR'): string => {
  if (isNaN(value)) return '—';
  
  if (currencyCode === 'INR') {
    // Format for Indian Rupees
    // For INR, we use the Indian numbering system: 1,00,000 instead of 100,000
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(value);
  } else {
    // Format for other currencies (default USD)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
};

// Format large numbers (e.g., market cap) based on currency
export const formatLargeNumber = (value: number, currencyCode: string = 'INR'): string => {
  if (!value && value !== 0) return '—';
  
  // First get the symbol
  const symbol = currencyCode === 'INR' ? '₹' : '$';
  
  if (value >= 1e12) {
    return `${symbol}${(value / 1e12).toFixed(2)} T`;
  } else if (value >= 1e9) {
    return `${symbol}${(value / 1e9).toFixed(2)} B`;
  } else if (value >= 1e7) { // 10 million threshold for INR (1 Cr is 10M)
    return `${symbol}${(value / 1e7).toFixed(2)} Cr`;
  } else if (value >= 1e5) { // 100 thousand threshold for INR (1 Lakh)
    return `${symbol}${(value / 1e5).toFixed(2)} L`;
  } else if (value >= 1e3) {
    return `${symbol}${(value / 1e3).toFixed(2)} K`;
  }
  return `${symbol}${value.toFixed(2)}`;
};

// Format percentage
export const formatPercentage = (value: number): string => {
  if (isNaN(value)) return '—';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Convert USD to INR
export const convertUsdToInr = (usdAmount: number, exchangeRate: number = DEFAULT_USD_TO_INR_RATE): number => {
  if (isNaN(usdAmount)) return 0;
  return usdAmount * exchangeRate;
};

// Fetch the latest USD to INR exchange rate
export const fetchExchangeRate = async (): Promise<number> => {
  // Check if we have a valid cached rate
  if (cachedExchangeRate && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    console.log('Using cached exchange rate:', cachedExchangeRate);
    return cachedExchangeRate;
  }

  try {
    console.log('Fetching fresh exchange rate from API...');
    const { data, error } = await supabase.functions.invoke('currency-exchange', {
      body: { 
        from: 'USD', 
        to: 'INR' 
      }
    });
    
    if (error) {
      console.error('Error fetching exchange rate:', error);
      return DEFAULT_USD_TO_INR_RATE;
    }
    
    if (data && data.rate) {
      // Update cache
      cachedExchangeRate = data.rate;
      cacheTimestamp = Date.now();
      return data.rate;
    }
    
    return DEFAULT_USD_TO_INR_RATE;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return DEFAULT_USD_TO_INR_RATE;
  }
};

// Hook to get and use the exchange rate in components
export const useExchangeRate = () => {
  const [rate, setRate] = useState<number>(DEFAULT_USD_TO_INR_RATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const getExchangeRate = async () => {
      setIsLoading(true);
      const exchangeRate = await fetchExchangeRate();
      setRate(exchangeRate);
      setIsLoading(false);
    };
    
    getExchangeRate();
  }, []);
  
  return { rate, isLoading };
};

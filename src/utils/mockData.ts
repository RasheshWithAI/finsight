
export interface MarketIndex {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  sector: string;
  isWatchlisted?: boolean;
  peRatio?: number;
  dividend?: number;
  high52?: number;
  low52?: number;
  description?: string;
  industry?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

export interface Budget {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: "cost-saving" | "investment" | "market";
  potentialSavings?: string;
  potentialReturn?: string;
  relatedStocks?: string[];
}

// Empty arrays for mockData as per user's request
export const mockStocks: Stock[] = [];

export const mockMarketIndices: MarketIndex[] = [];

export const mockInsights: Insight[] = [];

// Helper function to generate watchlist of stocks - returning empty array
export const generateWatchlist = () => {
  return [];
};

// Helper function to calculate financial summary - returning zeros
export const calculateFinancialSummary = () => {
  return {
    income: 0,
    expenses: 0,
    savings: 0,
    savingsRate: 0
  };
};

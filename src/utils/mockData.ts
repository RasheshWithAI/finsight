
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

// Empty arrays for all mock data (will only use market mocks when needed)
export const mockStocks: Stock[] = [
  {
    id: "AAPL",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.72,
    change: 2.45,
    changePercent: 1.39,
    volume: 47382910,
    marketCap: 2789432000000,
    pe: 27.5,
    sector: "Technology",
    peRatio: 27.5,
    dividend: 0.92,
    high52: 182.34,
    low52: 143.90,
  },
  {
    id: "MSFT",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 417.88,
    change: -1.23,
    changePercent: -0.29,
    volume: 22893400,
    marketCap: 3102450000000,
    pe: 34.2,
    sector: "Technology",
    peRatio: 34.2,
    dividend: 1.12,
    high52: 425.83,
    low52: 275.37,
  },
  {
    id: "GOOGL",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 153.94,
    change: 1.87,
    changePercent: 1.23,
    volume: 28945700,
    marketCap: 1892340000000,
    pe: 29.8,
    sector: "Technology",
    peRatio: 29.8,
    dividend: 0,
    high52: 155.23,
    low52: 102.21,
  },
  {
    id: "AMZN",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.15,
    change: 3.24,
    changePercent: 1.85,
    volume: 31245800,
    marketCap: 1856720000000,
    pe: 61.4,
    sector: "Consumer Cyclical",
    peRatio: 61.4,
    dividend: 0,
    high52: 185.12,
    low52: 118.35,
  },
  {
    id: "NVDA",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 881.86,
    change: 15.23,
    changePercent: 1.76,
    volume: 42567800,
    marketCap: 2178940000000,
    pe: 72.8,
    sector: "Technology",
    peRatio: 72.8,
    dividend: 0.16,
    high52: 974.00,
    low52: 222.97,
  }
];

export const mockMarketIndices: MarketIndex[] = [
  {
    id: "^DJI",
    name: "Dow Jones",
    value: 39045.67,
    change: 177.78,
    changePercent: 0.4575
  },
  {
    id: "^GSPC",
    name: "S&P 500",
    value: 5145.32,
    change: 34.76,
    changePercent: 0.6802
  },
  {
    id: "^IXIC",
    name: "NASDAQ",
    value: 16298.76,
    change: 100.31,
    changePercent: 0.6193
  },
  {
    id: "^RUT",
    name: "Russell 2000",
    value: 2067.34,
    change: 24.13,
    changePercent: 1.1810
  }
];

// Empty arrays for non-market related mock data
export const mockInsights: Insight[] = [];

// Helper function to generate watchlist of stocks - returning empty array except for Market page
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

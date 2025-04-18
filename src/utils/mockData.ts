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

export interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  date?: string;
  potentialSavings?: string;
  potentialReturn?: string;
  relatedStocks?: string[];
}

// Empty arrays for all mock data (will only use market mocks when needed)
export const mockStocks: Stock[] = [
  {
    id: "NVDA",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 881.86,
    change: 45.23,
    changePercent: 5.41,
    volume: 42567800,
    marketCap: 2178940000000,
    pe: 72.8,
    sector: "Technology",
    peRatio: 72.8,
    dividend: 0.16,
    high52: 974.00,
    low52: 222.97,
  },
  {
    id: "AMD",
    symbol: "AMD",
    name: "Advanced Micro Devices, Inc.",
    price: 167.45,
    change: 7.89,
    changePercent: 4.94,
    volume: 28945700,
    marketCap: 270560000000,
    pe: 385.2,
    sector: "Technology",
    peRatio: 385.2,
    dividend: 0,
    high52: 227.30,
    low52: 93.47,
  },
  {
    id: "AAPL",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 168.82,
    change: 5.45,
    changePercent: 3.33,
    volume: 57382910,
    marketCap: 2589432000000,
    pe: 26.5,
    sector: "Technology",
    peRatio: 26.5,
    dividend: 0.92,
    high52: 182.34,
    low52: 143.90,
  },
  {
    id: "TSLA",
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 147.05,
    change: -8.95,
    changePercent: -5.74,
    volume: 115672400,
    marketCap: 467890000000,
    pe: 42.3,
    sector: "Automotive",
    peRatio: 42.3,
    dividend: 0,
    high52: 299.29,
    low52: 138.80,
  },
  {
    id: "NFLX",
    symbol: "NFLX",
    name: "Netflix, Inc.",
    price: 562.80,
    change: -24.70,
    changePercent: -4.21,
    volume: 8234600,
    marketCap: 244520000000,
    pe: 47.2,
    sector: "Communication Services",
    peRatio: 47.2,
    dividend: 0,
    high52: 639.00,
    low52: 315.62,
  },
  {
    id: "META",
    symbol: "META",
    name: "Meta Platforms, Inc.",
    price: 482.25,
    change: -18.75,
    changePercent: -3.74,
    volume: 18234500,
    marketCap: 1234560000000,
    pe: 32.8,
    sector: "Technology",
    peRatio: 32.8,
    dividend: 0,
    high52: 523.57,
    low52: 229.85,
  },
  {
    id: "MSFT",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 402.75,
    change: 12.87,
    changePercent: 3.30,
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
    id: "AMZN",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 185.35,
    change: 4.85,
    changePercent: 2.69,
    volume: 31245800,
    marketCap: 1926720000000,
    pe: 61.4,
    sector: "Consumer Cyclical",
    peRatio: 61.4,
    dividend: 0,
    high52: 185.12,
    low52: 118.35,
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

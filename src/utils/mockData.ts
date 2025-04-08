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
  peRatio?: number;  // Using optional because some stocks might use pe instead
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

export const mockMarketIndices: MarketIndex[] = [
  { id: "1", name: "S&P 500", value: 4973.52, change: 12.45, changePercent: 0.25 },
  { id: "2", name: "Nasdaq", value: 15962.37, change: 65.30, changePercent: 0.41 },
  { id: "3", name: "Dow Jones", value: 38996.39, change: -89.51, changePercent: -0.23 },
  { id: "4", name: "Russell 2000", value: 2018.56, change: 5.78, changePercent: 0.29 }
];

export const mockStocks: Stock[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 187.62,
    change: 1.25,
    changePercent: 0.67,
    volume: 58762145,
    marketCap: 2950000000000,
    pe: 30.5,
    peRatio: 30.5,
    sector: "Technology",
    dividend: 0.92,
    high52: 199.62,
    low52: 143.90,
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    industry: "Consumer Electronics"
  },
  {
    id: "2",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 417.56,
    change: 3.27,
    changePercent: 0.79,
    volume: 25631087,
    marketCap: 3100000000000,
    pe: 34.2,
    peRatio: 34.2,
    sector: "Technology",
    dividend: 1.12,
    high52: 430.82,
    low52: 309.35,
    description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.",
    industry: "Software-Infrastructure"
  },
  {
    id: "3",
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 178.95,
    change: -1.53,
    changePercent: -0.85,
    volume: 31254896,
    marketCap: 1850000000000,
    pe: 62.3,
    peRatio: 62.3,
    sector: "Consumer Cyclical",
    dividend: 0,
    high52: 185.74,
    low52: 118.35,
    description: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores in North America and internationally.",
    industry: "Internet Retail"
  },
  {
    id: "4",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 150.73,
    change: 0.89,
    changePercent: 0.59,
    volume: 22145783,
    marketCap: 1900000000000,
    pe: 28.7,
    peRatio: 28.7,
    sector: "Communication Services",
    dividend: 0,
    high52: 155.37,
    low52: 102.63,
    description: "Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.",
    industry: "Internet Content & Information"
  },
  {
    id: "5",
    symbol: "META",
    name: "Meta Platforms, Inc.",
    price: 482.29,
    change: 4.12,
    changePercent: 0.86,
    volume: 18743209,
    marketCap: 1230000000000,
    pe: 25.3,
    peRatio: 25.3,
    sector: "Communication Services",
    dividend: 0,
    high52: 485.96,
    low52: 229.85,
    description: "Meta Platforms, Inc. engages in the development of products that enable people to connect and share with friends and family through mobile devices, personal computers, and other surfaces.",
    industry: "Internet Content & Information"
  },
  {
    id: "6",
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 175.21,
    change: -2.87,
    changePercent: -1.61,
    volume: 35891234,
    marketCap: 557000000000,
    pe: 42.8,
    peRatio: 42.8,
    sector: "Consumer Cyclical",
    dividend: 0,
    high52: 299.29,
    low52: 138.80,
    description: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems worldwide.",
    industry: "Auto Manufacturers"
  },
  {
    id: "7",
    symbol: "BRK.B",
    name: "Berkshire Hathaway Inc.",
    price: 403.56,
    change: 1.05,
    changePercent: 0.26,
    volume: 3621578,
    marketCap: 890000000000,
    pe: 9.2,
    peRatio: 9.2,
    sector: "Financial Services",
    dividend: 0,
    high52: 407.05,
    low52: 310.35,
    description: "Berkshire Hathaway Inc. engages in the insurance, freight rail transportation, and utility businesses worldwide.",
    industry: "Insurance-Diversified"
  },
  {
    id: "8",
    symbol: "V",
    name: "Visa Inc.",
    price: 275.96,
    change: 0.42,
    changePercent: 0.15,
    volume: 8123654,
    marketCap: 570000000000,
    pe: 29.6,
    peRatio: 29.6,
    sector: "Financial Services",
    dividend: 1.8,
    high52: 290.96,
    low52: 227.35,
    description: "Visa Inc. operates as a payments technology company worldwide. It facilitates digital payments among consumers, merchants, financial institutions, businesses, strategic partners, and government entities.",
    industry: "Credit Services"
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-04-05",
    description: "Salary Deposit",
    category: "Income",
    amount: 3500,
    type: "income"
  },
  {
    id: "2",
    date: "2025-04-04",
    description: "Grocery Store",
    category: "Food & Dining",
    amount: 125.47,
    type: "expense"
  },
  {
    id: "3",
    date: "2025-04-03",
    description: "Electric Bill",
    category: "Utilities",
    amount: 98.36,
    type: "expense"
  },
  {
    id: "4",
    date: "2025-04-02",
    description: "Online Course",
    category: "Education",
    amount: 49.99,
    type: "expense"
  },
  {
    id: "5",
    date: "2025-04-01",
    description: "Freelance Work",
    category: "Income",
    amount: 750,
    type: "income"
  },
  {
    id: "6",
    date: "2025-03-30",
    description: "Restaurant Dinner",
    category: "Food & Dining",
    amount: 86.23,
    type: "expense"
  },
  {
    id: "7",
    date: "2025-03-29",
    description: "Gas Station",
    category: "Transportation",
    amount: 52.15,
    type: "expense"
  }
];

export const mockBudgets: Budget[] = [
  {
    id: "1",
    category: "Food & Dining",
    budgeted: 600,
    spent: 211.7,
    period: "monthly"
  },
  {
    id: "2",
    category: "Transportation",
    budgeted: 300,
    spent: 52.15,
    period: "monthly"
  },
  {
    id: "3", 
    category: "Entertainment",
    budgeted: 200,
    spent: 0,
    period: "monthly"
  },
  {
    id: "4",
    category: "Utilities",
    budgeted: 350,
    spent: 98.36,
    period: "monthly"
  },
  {
    id: "5",
    category: "Education",
    budgeted: 100,
    spent: 49.99,
    period: "monthly"
  }
];

export const mockInsights = [
  {
    id: "1",
    type: "cost-saving",
    title: "Reduce Food Expenses",
    description: "Your food spending is trending 15% higher than last month. Consider meal planning to reduce costs.",
    potentialSavings: "$90/month"
  },
  {
    id: "2",
    type: "investment",
    title: "Investment Opportunity",
    description: "Based on your current savings, you could invest $500 in index funds this month without impacting your emergency fund.",
    potentialReturn: "~8% annually"
  },
  {
    id: "3",
    type: "market-alert",
    title: "Technology Sector Trending Up",
    description: "The technology sector has risen 3.2% this week. Your watchlist stocks in this sector are performing well.",
    relatedStocks: ["AAPL", "MSFT"]
  }
];

// Helper function to generate watchlist of stocks
export const generateWatchlist = () => {
  // In a real app, this would come from user data
  // For demo purposes, we're just selecting a few stocks
  return mockStocks.slice(0, 4).map(stock => ({
    ...stock,
    isWatchlisted: true
  }));
};

// Helper function to calculate financial summary
export const calculateFinancialSummary = () => {
  const income = mockTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = mockTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  
  return {
    income,
    expenses,
    savings,
    savingsRate
  };
};

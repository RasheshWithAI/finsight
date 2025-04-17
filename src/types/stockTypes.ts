
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

export type StockSearchResult = {
  id: string;
  symbol: string;
  name: string;
  type?: string;
  region?: string;
  marketOpen?: string;
  marketClose?: string;
  timezone?: string;
  currency?: string;
};

export type StockHistoryPoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

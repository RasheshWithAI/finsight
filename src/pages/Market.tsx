import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { mockStocks, Stock } from "@/utils/mockData";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  BookmarkPlus, 
  BookmarkMinus, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  BarChart4,
  Globe,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useStockData } from "@/hooks/useStockData";

const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [selectedExchange, setSelectedExchange] = useState("NYSE");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { marketIndices, refetchMarketIndices, searchStocks, isLoading: isStockDataLoading } = useStockData();
  
  // Define available stock exchanges
  const stockExchanges = [
    { id: "NYSE", name: "NYSE (New York Stock Exchange)" },
    { id: "NASDAQ", name: "NASDAQ" },
    { id: "SSE", name: "SSE (Shanghai Stock Exchange)" },
    { id: "TSE", name: "Tokyo Stock Exchange" },
    { id: "NSE", name: "NSE (National Stock Exchange of India)" }
  ];

  // Format currency function
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Format large numbers (e.g., market cap)
  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) {
      return (value / 1e12).toFixed(2) + ' T';
    } else if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + ' B';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + ' M';
    }
    return value.toString();
  };

  // Format percentage function
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  // Handle exchange selection change
  const handleExchangeChange = async (value: string) => {
    setIsLoading(true);
    setSelectedExchange(value);
    
    try {
      // Search for popular stocks on the selected exchange
      const exchangeKeywords = {
        "NYSE": "NYSE popular",
        "NASDAQ": "NASDAQ tech",
        "SSE": "Shanghai",
        "TSE": "Tokyo",
        "NSE": "India"
      };
      
      const results = await searchStocks(exchangeKeywords[value as keyof typeof exchangeKeywords] || value);
      
      if (results && results.length > 0) {
        // Convert API results to our stock format
        const stocksData: Stock[] = results.map((item: any, index: number) => ({
          id: item.symbol,
          symbol: item.symbol,
          name: item.name,
          price: parseFloat((Math.random() * 500 + 10).toFixed(2)), // Placeholder until we fetch actual quotes
          change: parseFloat((Math.random() * 10 - 5).toFixed(2)), // Placeholder
          changePercent: parseFloat((Math.random() * 10 - 5).toFixed(2)), // Placeholder
          marketCap: Math.floor(Math.random() * 1000000000000), // Placeholder
          volume: Math.floor(Math.random() * 10000000), // Placeholder
          pe: Math.random() * 30 + 5, // Adding missing required property
          sector: "Technology", // Adding missing required property
          isWatchlisted: watchlist.some(w => w.symbol === item.symbol),
        }));
        
        setStocks(stocksData);
      } else {
        // If no results, keep using mock data
        toast.info(`No data available for ${value}. Using sample data instead.`);
        setStocks(mockStocks);
      }
    } catch (error) {
      console.error("Error fetching exchange data:", error);
      toast.error(`Failed to load data for ${value}. Using sample data instead.`);
      setStocks(mockStocks);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWatchlist = (stock: Stock) => {
    if (watchlist.some(item => item.id === stock.id)) {
      setWatchlist(watchlist.filter(item => item.id !== stock.id));
      toast.success(`Removed ${stock.symbol} from your watchlist`);
    } else {
      setWatchlist([...watchlist, {
        ...stock,
        isWatchlisted: true
      }]);
      toast.success(`Added ${stock.symbol} to your watchlist`);
    }
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/market/stock/${symbol}`);
  };

  const handleCompareClick = () => {
    navigate('/market/compare');
  };
  
  const handleRefreshData = () => {
    refetchMarketIndices();
    handleExchangeChange(selectedExchange);
    toast.success("Market data refreshed");
  };

  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Initialize market data when component mounts
  useEffect(() => {
    handleExchangeChange(selectedExchange);
  }, []);

  return (
    <div className="container px-4 py-6 animate-fade-in bg-gray-900">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-aura-primary-text">
              Market
            </h1>
            <p className="text-aura-secondary-text">
              Track stocks, indices, and market trends
            </p>
          </div>
          <Button onClick={handleCompareClick} className="bg-accent-gradient text-aura-dark-gray hover:brightness-105 rounded-2xl">
            <BarChart4 className="h-4 w-4 mr-2" /> Compare Stocks
          </Button>
        </div>
      </header>

      {/* Stock Exchange Selection */}
      <div className="mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-primary-text mr-2" />
            <span className="text-sm font-medium text-aura-primary-text">Exchange:</span>
          </div>
          <Select value={selectedExchange} onValueChange={handleExchangeChange}>
            <SelectTrigger className="w-[240px] bg-purple-800 rounded-lg border-none focus:ring-2 focus:ring-purple-500">
              <SelectValue placeholder="Select Exchange" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              {stockExchanges.map((exchange) => (
                <SelectItem key={exchange.id} value={exchange.id} className="hover:bg-gray-700">
                  {exchange.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(isLoading || isStockDataLoading) && (
            <div className="flex items-center">
              <RefreshCw className="h-4 w-4 animate-spin text-primary-text mr-2" />
              <span className="text-sm text-aura-primary-text">Loading data...</span>
            </div>
          )}
        </div>
      </div>

      {/* Market Indices */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-aura-primary-text">Market Indices</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            className="flex items-center gap-1 text-aura-medium-gray bg-transparent hover:bg-gray-800"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Refresh</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {marketIndices && marketIndices.length > 0 ? 
            marketIndices.map(index => (
              <Card key={index.id} className="financial-card rounded-2xl bg-emerald-800">
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm text-aura-primary-text">{index.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xl font-bold text-aura-primary-text">{index.value.toLocaleString()}</span>
                    <div className={`flex items-center ${index.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {index.change >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                      <span>{formatPercentage(index.changePercent)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : 
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="financial-card rounded-2xl bg-emerald-800">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-300" />
                    <h3 className="font-medium text-sm text-aura-primary-text">Loading index data...</h3>
                  </div>
                  <div className="animate-pulse mt-2">
                    <div className="h-6 bg-emerald-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </div>

      {/* Stock Search and Tabs */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-aura-medium-gray" />
            <Input placeholder="Search stocks..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-purple-800 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10 bg-purple-800 hover:bg-purple-700">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 bg-purple-800 hover:bg-purple-700" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all" className="text-zinc-50 rounded-3xl bg-amber-500 hover:bg-amber-400">All Stocks</TabsTrigger>
            <TabsTrigger value="watchlist" className="text-slate-50 rounded-3xl bg-amber-500 hover:bg-amber-400">Watchlist</TabsTrigger>
            <TabsTrigger value="sectors" className="text-slate-50 rounded-3xl bg-amber-500 hover:bg-amber-400">Sectors</TabsTrigger>
          </TabsList>
          
          {/* Tabs content */}
          <TabsContent value="all">
            <Card className="financial-card overflow-hidden bg-sky-950">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Symbol</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Name</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Change</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Market Cap</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Watch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map(stock => {
                    const isWatchlisted = watchlist.some(item => item.id === stock.id);
                    return <tr key={stock.id} className="border-b border-gray-800 hover:bg-gray-900/30 cursor-pointer" onClick={e => {
                      // Don't navigate when clicking on the watchlist button
                      if ((e.target as HTMLElement).closest('button')) return;
                      handleStockClick(stock.symbol);
                    }}>
                          <td className="px-4 py-3 text-sm font-medium">{stock.symbol}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{stock.name}</td>
                          <td className="px-4 py-3 text-sm text-right">{formatCurrency(stock.price)}</td>
                          <td className={`px-4 py-3 text-sm text-right ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            <div className="flex items-center justify-end">
                              {stock.change >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                              {formatPercentage(stock.changePercent)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">{formatLargeNumber(stock.marketCap)}</td>
                          <td className="px-4 py-3 text-center">
                            <Button variant="ghost" size="icon" className={`h-8 w-8 ${isWatchlisted ? 'text-aura-gold' : 'text-gray-400'}`} onClick={e => {
                          e.stopPropagation();
                          toggleWatchlist(stock);
                        }}>
                              {isWatchlisted ? <BookmarkMinus className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                            </Button>
                          </td>
                        </tr>;
                  })}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
          
          {/* Watchlist Tab */}
          <TabsContent value="watchlist">
            <Card className="financial-card">
              {watchlist.length === 0 ? <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <BookmarkPlus className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No stocks in your watchlist</h3>
                  <p className="text-aura-secondary-text mb-4">
                    Add stocks to your watchlist to keep track of them here
                  </p>
                  <Button onClick={() => {
                const allTabTrigger = document.querySelector('[data-value="all"]');
                if (allTabTrigger) {
                  (allTabTrigger as HTMLElement).click();
                }
              }}>
                    Browse Stocks
                  </Button>
                </CardContent> : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Symbol</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Name</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Change</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">Watch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {watchlist.map(stock => <tr key={stock.id} className="border-b border-gray-800 hover:bg-gray-900/30 cursor-pointer" onClick={() => handleStockClick(stock.symbol)}>
                          <td className="px-4 py-3 text-sm font-medium">{stock.symbol}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{stock.name}</td>
                          <td className="px-4 py-3 text-sm text-right">{formatCurrency(stock.price)}</td>
                          <td className={`px-4 py-3 text-sm text-right ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            <div className="flex items-center justify-end">
                              {stock.change >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                              {formatPercentage(stock.changePercent)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-aura-gold" onClick={e => {
                        e.stopPropagation();
                        toggleWatchlist(stock);
                      }}>
                              <BookmarkMinus className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>}
            </Card>
          </TabsContent>
          
          {/* Sectors Tab */}
          <TabsContent value="sectors">
            <Card className="financial-card p-6 bg-sky-950 rounded-2xl">
              <h3 className="text-lg font-medium mb-4">Sectors Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Technology</p>
                    <p className="text-sm text-gray-400">32 stocks</p>
                  </div>
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+2.14%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Financial Services</p>
                    <p className="text-sm text-gray-400">28 stocks</p>
                  </div>
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+0.87%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Healthcare</p>
                    <p className="text-sm text-gray-400">24 stocks</p>
                  </div>
                  <div className="flex items-center text-red-400">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>-0.32%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Consumer Cyclical</p>
                    <p className="text-sm text-gray-400">19 stocks</p>
                  </div>
                  <div className="flex items-center text-red-400">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>-1.25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Communication Services</p>
                    <p className="text-sm text-gray-400">15 stocks</p>
                  </div>
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+0.62%</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Trending Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-aura-primary-text">Trending Today</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <Card className="financial-card bg-green-700 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                Top Gainers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-800">
                {stocks.filter(s => s.change > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 4).map(stock => <li key={stock.id} className="py-2 flex justify-between items-center cursor-pointer" onClick={() => handleStockClick(stock.symbol)}>
                      <div>
                        <p className="font-medium text-aura-primary-text">{stock.symbol}</p>
                        <p className="text-xs text-aura-medium-gray text-slate-900">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-aura-primary-text">{formatCurrency(stock.price)}</p>
                        <p className="text-xs text-green-400 flex items-center justify-end">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          {formatPercentage(stock.changePercent)}
                        </p>
                      </div>
                    </li>)}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="financial-card bg-red-700 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <TrendingDown className="h-4 w-4 mr-2 text-red-400" />
                Top Losers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-800">
                {stocks.filter(s => s.change < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 4).map(stock => <li key={stock.id} className="py-2 flex justify-between items-center cursor-pointer" onClick={() => handleStockClick(stock.symbol)}>
                      <div>
                        <p className="font-medium text-aura-primary-text">{stock.symbol}</p>
                        <p className="text-xs text-aura-medium-gray text-slate-900">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-aura-primary-text">{formatCurrency(stock.price)}</p>
                        <p className="text-xs text-red-400 flex items-center justify-end">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          {formatPercentage(Math.abs(stock.changePercent))}
                        </p>
                      </div>
                    </li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Market;

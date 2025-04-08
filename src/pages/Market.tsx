
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockMarketIndices, mockStocks, Stock } from "@/utils/mockData";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  BookmarkPlus, 
  BookmarkMinus,
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw
} from "lucide-react";

const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState(mockStocks);
  const [watchlist, setWatchlist] = useState<Stock[]>([]);

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

  const toggleWatchlist = (stock: Stock) => {
    if (watchlist.some(item => item.id === stock.id)) {
      setWatchlist(watchlist.filter(item => item.id !== stock.id));
    } else {
      setWatchlist([...watchlist, { ...stock, isWatchlisted: true }]);
    }
  };

  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container px-4 py-6 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-finance-text-primary">
          Market
        </h1>
        <p className="text-finance-text-secondary">
          Track stocks, indices, and market trends
        </p>
      </header>

      {/* Market Indices */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-finance-text-primary">Market Indices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {mockMarketIndices.map((index) => (
            <Card key={index.id} className="financial-card">
              <CardContent className="p-4">
                <h3 className="font-medium text-sm">{index.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl font-bold">{index.value.toLocaleString()}</span>
                  <div className={`flex items-center ${index.change >= 0 ? 'text-finance-accent' : 'text-finance-danger'}`}>
                    {index.change >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    <span>{formatPercentage(index.changePercent)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stock Search and Tabs */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Stocks</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card className="financial-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-finance-text-tertiary">Symbol</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-finance-text-tertiary">Name</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-finance-text-tertiary">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-finance-text-tertiary">Change</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-finance-text-tertiary">Market Cap</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-finance-text-tertiary">Watch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map((stock) => {
                      const isWatchlisted = watchlist.some(item => item.id === stock.id);
                      return (
                        <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{stock.symbol}</td>
                          <td className="px-4 py-3 text-sm text-finance-text-secondary">{stock.name}</td>
                          <td className="px-4 py-3 text-sm text-right">{formatCurrency(stock.price)}</td>
                          <td className={`px-4 py-3 text-sm text-right ${stock.change >= 0 ? 'text-finance-accent' : 'text-finance-danger'}`}>
                            <div className="flex items-center justify-end">
                              {stock.change >= 0 ? (
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                              )}
                              {formatPercentage(stock.changePercent)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">{formatLargeNumber(stock.marketCap)}</td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${isWatchlisted ? 'text-finance-primary' : 'text-gray-400'}`}
                              onClick={() => toggleWatchlist(stock)}
                            >
                              {isWatchlisted ? (
                                <BookmarkMinus className="h-4 w-4" />
                              ) : (
                                <BookmarkPlus className="h-4 w-4" />
                              )}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="watchlist">
            <Card className="financial-card">
              {watchlist.length === 0 ? (
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <BookmarkPlus className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No stocks in your watchlist</h3>
                  <p className="text-finance-text-secondary mb-4">
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
                </CardContent>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-finance-text-tertiary">Symbol</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-finance-text-tertiary">Name</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-finance-text-tertiary">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-finance-text-tertiary">Change</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-finance-text-tertiary">Watch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {watchlist.map((stock) => (
                        <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{stock.symbol}</td>
                          <td className="px-4 py-3 text-sm text-finance-text-secondary">{stock.name}</td>
                          <td className="px-4 py-3 text-sm text-right">{formatCurrency(stock.price)}</td>
                          <td className={`px-4 py-3 text-sm text-right ${stock.change >= 0 ? 'text-finance-accent' : 'text-finance-danger'}`}>
                            <div className="flex items-center justify-end">
                              {stock.change >= 0 ? (
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                              )}
                              {formatPercentage(stock.changePercent)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-finance-primary"
                              onClick={() => toggleWatchlist(stock)}
                            >
                              <BookmarkMinus className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="sectors">
            <Card className="financial-card p-6">
              <h3 className="text-lg font-medium mb-4">Sectors Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Technology</p>
                    <p className="text-sm text-finance-text-secondary">32 stocks</p>
                  </div>
                  <div className="flex items-center text-finance-accent">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+2.14%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Financial Services</p>
                    <p className="text-sm text-finance-text-secondary">28 stocks</p>
                  </div>
                  <div className="flex items-center text-finance-accent">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+0.87%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Healthcare</p>
                    <p className="text-sm text-finance-text-secondary">24 stocks</p>
                  </div>
                  <div className="flex items-center text-finance-danger">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>-0.32%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Consumer Cyclical</p>
                    <p className="text-sm text-finance-text-secondary">19 stocks</p>
                  </div>
                  <div className="flex items-center text-finance-danger">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>-1.25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Communication Services</p>
                    <p className="text-sm text-finance-text-secondary">15 stocks</p>
                  </div>
                  <div className="flex items-center text-finance-accent">
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
        <h2 className="text-lg font-semibold mb-3 text-finance-text-primary">Trending Today</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="financial-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-finance-accent" />
                Top Gainers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-100">
                {mockStocks
                  .filter(s => s.change > 0)
                  .sort((a, b) => b.changePercent - a.changePercent)
                  .slice(0, 4)
                  .map(stock => (
                    <li key={stock.id} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-xs text-finance-text-tertiary">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(stock.price)}</p>
                        <p className="text-xs text-finance-accent flex items-center justify-end">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          {formatPercentage(stock.changePercent)}
                        </p>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </CardContent>
          </Card>
          
          <Card className="financial-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <TrendingDown className="h-4 w-4 mr-2 text-finance-danger" />
                Top Losers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-100">
                {mockStocks
                  .filter(s => s.change < 0)
                  .sort((a, b) => a.changePercent - b.changePercent)
                  .slice(0, 4)
                  .map(stock => (
                    <li key={stock.id} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-xs text-finance-text-tertiary">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(stock.price)}</p>
                        <p className="text-xs text-finance-danger flex items-center justify-end">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          {formatPercentage(Math.abs(stock.changePercent))}
                        </p>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Market;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockStocks } from "@/utils/mockData";
import { toast } from "sonner";
import StockLineChart from "@/components/charts/StockLineChart";
import { useStockData } from "@/hooks/useStockData";
import { ArrowDown, ArrowUp, BookmarkPlus, BookmarkMinus, ArrowLeft, Share2, BarChart4, TrendingUp, Loader2 } from "lucide-react";

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [stockData, setStockData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getStockQuote } = useStockData();

  // Find the stock by symbol or use default data
  const defaultStock = mockStocks.find(s => s.symbol === symbol) || {
    id: "default",
    symbol: symbol || "AAPL",
    name: "Apple Inc.",
    price: 185.92,
    change: 2.58,
    changePercent: 1.41,
    marketCap: 2900000000000,
    peRatio: 30.5,
    dividend: 0.92,
    volume: 68500000,
    high52: 199.62,
    low52: 143.90,
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and wearables, home, and accessories.",
    sector: "Technology",
    industry: "Consumer Electronics"
  };
  
  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      if (symbol) {
        try {
          const quote = await getStockQuote(symbol);
          
          if (quote) {
            // Merge the API data with our default stock data to ensure we have all fields
            setStockData({
              ...defaultStock,
              price: quote.price,
              change: quote.change,
              changePercent: quote.changePercent,
              volume: quote.volume,
              // Other fields will come from our default data
            });
          } else {
            setStockData(defaultStock);
            toast.info("Using sample stock data as real-time data is unavailable");
          }
        } catch (error) {
          console.error("Error fetching stock data:", error);
          setStockData(defaultStock);
          toast.error("Failed to fetch real-time data. Using sample data instead.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchStockData();
  }, [symbol]);
  
  const stock = stockData || defaultStock;
  
  const handleToggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
    toast.success(isWatchlisted ? `Removed ${stock.symbol} from your watchlist` : `Added ${stock.symbol} to your watchlist`);
  };
  
  const handleCompare = () => {
    navigate("/market/compare", {
      state: {
        initialStock: stock
      }
    });
  };

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
  
  const refreshStockData = async () => {
    if (symbol) {
      try {
        setIsLoading(true);
        const quote = await getStockQuote(symbol);
        
        if (quote) {
          setStockData(prev => ({
            ...prev,
            price: quote.price,
            change: quote.change,
            changePercent: quote.changePercent,
            volume: quote.volume,
          }));
          toast.success(`${symbol} data refreshed`);
        }
      } catch (error) {
        toast.error("Failed to refresh stock data");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="container px-4 py-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/market")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-aura-primary-text">{stock.name} ({stock.symbol})</h1>
      </div>

      {/* Stock Overview */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Card className="financial-card flex-grow rounded-2xl">
          <CardContent className="p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-aura-gold" />
                    <span className="text-aura-secondary-text">Fetching latest data...</span>
                  </div>
                ) : (
                  <div className="flex items-baseline">
                    <h2 className="text-2xl font-bold text-aura-gold">{formatCurrency(stock.price)}</h2>
                    <span className={`ml-2 flex items-center ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {stock.change >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                      {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                )}
                <p className="text-sm text-aura-secondary-text">Last updated: {new Date().toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={refreshStockData} disabled={isLoading}>
                  <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleToggleWatchlist} className={isWatchlisted ? "text-aura-gold border-aura-gold" : ""}>
                  {isWatchlisted ? <BookmarkMinus className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={handleCompare}>
                  <BarChart4 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stock Chart */}
      <Card className="financial-card mb-6 rounded-2xl">
        <CardContent className="p-6">
          <StockLineChart symbol={stock.symbol} />
        </CardContent>
      </Card>

      {/* Stock Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Key Statistics */}
        <Card className="financial-card rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-aura-gold" />
              Key Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-aura-secondary-text">Market Cap</dt>
                <dd className="font-medium">{formatLargeNumber(stock.marketCap)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-aura-secondary-text">P/E Ratio</dt>
                <dd className="font-medium">{stock.peRatio?.toFixed(2) || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-aura-secondary-text">Dividend Yield</dt>
                <dd className="font-medium">{stock.dividend ? `${stock.dividend}%` : "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-aura-secondary-text">Volume</dt>
                <dd className="font-medium">{formatLargeNumber(stock.volume || 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-aura-secondary-text">52 Week High</dt>
                <dd className="font-medium">{formatCurrency(stock.high52 || 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-aura-secondary-text">52 Week Low</dt>
                <dd className="font-medium">{formatCurrency(stock.low52 || 0)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Company Overview */}
        <Card className="financial-card lg:col-span-2 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Company Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <p className="text-sm text-aura-primary-text">{stock.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-aura-secondary-text">Sector</p>
                  <p className="font-medium">{stock.sector || "Technology"}</p>
                </div>
                <div>
                  <p className="text-sm text-aura-secondary-text">Industry</p>
                  <p className="font-medium">{stock.industry || "Consumer Electronics"}</p>
                </div>
              </div>

              <div className="pt-4">
                
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockDetail;

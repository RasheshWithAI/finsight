
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockStocks, Stock } from "@/utils/mockData";
import { toast } from "sonner";
import StockLineChart from "@/components/charts/StockLineChart";
import { ArrowLeft, Search, X, Plus, PlusCircle, Loader2 } from "lucide-react";
import { useStockData } from "@/hooks/useStockData";

// Generate sample comparison data with slightly different values
const generateComparisonData = (days: number) => {
  const data = [];
  let price = 180;
  const baseDate = new Date(2024, 3, 7); // April 7, 2024

  for (let i = days; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - i);

    // Random price movement with some trend
    const change = price * (Math.random() * 0.025 - 0.01);
    price = Number((price + change).toFixed(2));
    data.push({
      date: date.toISOString().split('T')[0],
      price,
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }
  return data;
};
const comparisonData = generateComparisonData(365);

const StockCompare = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialStock = location.state?.initialStock;
  const [stocks, setStocks] = useState<Stock[]>(initialStock ? [initialStock] : []);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const { searchStocks, getStockQuote } = useStockData();

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
  
  // Handle search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        setIsSearching(true);
        try {
          const results = await searchStocks(searchTerm);
          
          // Filter out stocks that are already added
          const filteredResults = results.filter((result: any) => 
            !stocks.some(s => s.symbol === result.symbol)
          );
          
          setSearchResults(filteredResults);
          setShowResults(true);
        } catch (error) {
          console.error("Error searching stocks:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, stocks]);
  
  const handleAddStock = async (stock: any) => {
    if (stocks.length >= 3) {
      toast.error("Maximum 3 stocks can be compared at once");
      return;
    }
    
    if (stocks.some(s => s.symbol === stock.symbol)) {
      toast.error(`${stock.symbol} is already added for comparison`);
      return;
    }
    
    try {
      // Get current stock data
      const quote = await getStockQuote(stock.symbol);
      
      let newStock: Stock;
      if (quote) {
        newStock = {
          id: stock.symbol,
          symbol: stock.symbol,
          name: stock.name || stock.symbol,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          volume: quote.volume,
          marketCap: Math.floor(Math.random() * 1000000000000), // Placeholder
          peRatio: Math.random() * 50, // Placeholder
          dividend: Math.random() * 5, // Placeholder
          high52: quote.price * 1.2, // Placeholder
          low52: quote.price * 0.8, // Placeholder
        };
      } else {
        // Fallback to default data if quote is unavailable
        const mockStock = mockStocks.find(ms => ms.symbol === stock.symbol);
        newStock = mockStock || {
          id: stock.symbol,
          symbol: stock.symbol,
          name: stock.name || stock.symbol,
          price: 100 + Math.random() * 200,
          change: Math.random() * 10 - 5,
          changePercent: Math.random() * 10 - 5,
          volume: Math.floor(Math.random() * 10000000),
          marketCap: Math.floor(Math.random() * 1000000000000),
          peRatio: Math.random() * 50,
          dividend: Math.random() * 5,
        };
        toast.info(`Using sample data for ${stock.symbol}`);
      }
      
      setStocks([...stocks, newStock]);
      setSearchTerm("");
      toast.success(`${stock.symbol} added to comparison`);
    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error(`Failed to add ${stock.symbol}. Please try again.`);
    }
  };
  
  const handleRemoveStock = (stockId: string) => {
    setStocks(stocks.filter(s => s.id !== stockId));
    toast.success("Stock removed from comparison");
  };
  
  return (
    <div className="container px-4 py-6 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/market")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-aura-primary-text">
          Stock Comparison
        </h1>
      </div>

      {/* Stock Selector */}
      <Card className="financial-card mb-6 bg-amber-500">
        <CardContent className="p-4">
          <div className="mb-4">
            <h2 className="font-semibold mb-2 text-3xl">Selected Stocks ({stocks.length}/3)</h2>
            
            {stocks.length === 0 ? (
              <p className="text-aura-secondary-text py-2 text-gray-50 mx-[2px] my-0">
                Add stocks to compare using the search below
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 mb-3">
                {stocks.map(stock => (
                  <div key={stock.id} className="flex items-center bg-aura-dark-gray px-3 py-1 rounded-full">
                    <span className="font-medium text-aura-primary-text mr-1">{stock.symbol}</span>
                    <button onClick={() => handleRemoveStock(stock.id)} className="ml-1 text-gray-400 hover:text-red-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {stocks.length < 3 && (
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search for stocks to compare..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="pl-10 bg-neutral-950 rounded-2xl py-0 my-0 mx-0 px-[41px]" 
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>
                
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-aura-dark-gray border border-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((stock: any, index: number) => (
                      <div 
                        key={`${stock.symbol}-${index}`} 
                        className="px-4 py-2 hover:bg-aura-charcoal cursor-pointer flex justify-between items-center" 
                        onClick={() => handleAddStock(stock)}
                      >
                        <div>
                          <span className="font-medium">{stock.symbol}</span>
                          <span className="ml-2 text-sm text-aura-secondary-text">{stock.name}</span>
                        </div>
                        <PlusCircle className="h-4 w-4 text-aura-gold" />
                      </div>
                    ))}
                  </div>
                )}
                
                {showResults && searchResults.length === 0 && searchTerm && !isSearching && (
                  <div className="absolute z-10 mt-1 w-full bg-aura-dark-gray border border-gray-800 rounded-md shadow-lg p-3 text-center">
                    <p className="text-aura-secondary-text">No matching stocks found</p>
                  </div>
                )}
              </div>
            )}
            
            {stocks.length === 0 && (
              <div className="mt-3 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => handleAddStock({symbol: "AAPL", name: "Apple Inc."})} 
                  className="flex items-center bg-blue-950 hover:bg-blue-800 rounded-2xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sample Stock (AAPL)
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Performance Comparison Chart */}
      {stocks.length > 0 && (
        <Card className="financial-card mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <StockLineChart 
              symbol={stocks.map(s => s.symbol).join(" vs. ")} 
              showOverlay={stocks.length > 1} 
              comparisonData={stocks.length > 1 ? comparisonData : undefined} 
            />
          </CardContent>
        </Card>
      )}

      {/* Side by Side Comparison */}
      {stocks.length > 1 && (
        <Card className="financial-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Key Metrics Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="p-2 text-left text-xs font-medium text-gray-400">Metric</th>
                  {stocks.map(stock => (
                    <th key={stock.id} className="p-2 text-left text-xs font-medium">
                      <span className="text-aura-gold">{stock.symbol}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="p-2 text-left text-aura-secondary-text">Price</td>
                  {stocks.map(stock => (
                    <td key={stock.id} className="p-2 text-left font-medium">
                      {formatCurrency(stock.price)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-2 text-left text-aura-secondary-text">Market Cap</td>
                  {stocks.map(stock => (
                    <td key={stock.id} className="p-2 text-left font-medium">
                      {formatLargeNumber(stock.marketCap || 0)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-2 text-left text-aura-secondary-text">P/E Ratio</td>
                  {stocks.map(stock => (
                    <td key={stock.id} className="p-2 text-left font-medium">
                      {stock.peRatio?.toFixed(2) || "N/A"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-2 text-left text-aura-secondary-text">Dividend Yield</td>
                  {stocks.map(stock => (
                    <td key={stock.id} className="p-2 text-left font-medium">
                      {stock.dividend ? `${stock.dividend}%` : "N/A"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-2 text-left text-aura-secondary-text">52-Week High</td>
                  {stocks.map(stock => (
                    <td key={stock.id} className="p-2 text-left font-medium">
                      {formatCurrency(stock.high52 || stock.price * 1.2)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 text-left text-aura-secondary-text">52-Week Low</td>
                  {stocks.map(stock => (
                    <td key={stock.id} className="p-2 text-left font-medium">
                      {formatCurrency(stock.low52 || stock.price * 0.8)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockCompare;

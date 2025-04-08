import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { calculateFinancialSummary, generateWatchlist, mockInsights, mockMarketIndices } from "@/utils/mockData";
import { ArrowDownRight, ArrowUpRight, BarChart3, ChevronRight, DollarSign, Eye, LineChart, Lightbulb, Percent, PiggyBank } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const [financialSummary, setFinancialSummary] = useState(calculateFinancialSummary());
  const [watchlist, setWatchlist] = useState(generateWatchlist());
  const [currentMarketIndices, setCurrentMarketIndices] = useState(mockMarketIndices);
  const [currentInsights, setCurrentInsights] = useState(mockInsights.slice(0, 2));

  // Format currency function
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Format percentage function
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };
  return <div className="container px-4 py-6 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-aura-primary-text">
          Welcome, {user?.name || 'Investor'}
        </h1>
        <p className="text-aura-secondary-text">
          Your financial overview for April 2025
        </p>
      </header>

      {/* Financial Summary Cards */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-aura-primary-text">Financial Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="financial-card">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="stat-label">Income</span>
                <DollarSign className="h-4 w-4 text-aura-gold" />
              </div>
              <span className="stat-value mt-2">{formatCurrency(financialSummary.income)}</span>
            </CardContent>
          </Card>
          
          <Card className="financial-card">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="stat-label">Expenses</span>
                <BarChart3 className="h-4 w-4 text-red-400" />
              </div>
              <span className="stat-value mt-2">{formatCurrency(financialSummary.expenses)}</span>
            </CardContent>
          </Card>
          
          <Card className="financial-card">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="stat-label">Savings</span>
                <PiggyBank className="h-4 w-4 text-aura-chart-blue" />
              </div>
              <span className="stat-value mt-2">{formatCurrency(financialSummary.savings)}</span>
            </CardContent>
          </Card>
          
          <Card className="financial-card">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="stat-label">Savings Rate</span>
                <Percent className="h-4 w-4 text-aura-medium-gray" />
              </div>
              <span className="stat-value mt-2 py-[30px] px-[29px] my-[12px] mx-[8px] rounded-2xl bg-violet-900">{formatPercentage(financialSummary.savingsRate)}</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Market Summary */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-aura-primary-text">Market Summary</h2>
          <Link to="/market" className="text-sm text-aura-gold flex items-center hover:text-aura-bright-gold">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            {currentMarketIndices.map(index => <Card key={index.id} className="financial-card w-60 flex-shrink-0">
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm">{index.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xl font-bold">{index.value.toLocaleString()}</span>
                    <div className={`flex items-center ${index.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {index.change >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                      <span>{formatPercentage(index.changePercent)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Watchlist */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-aura-primary-text">Your Watchlist</h2>
          <Link to="/market" className="text-sm text-aura-gold flex items-center hover:text-aura-bright-gold">
            Manage <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4">
          {watchlist.length === 0 ? <Card className="financial-card p-6 flex flex-col items-center justify-center text-center">
              <Eye className="h-8 w-8 text-aura-medium-gray mb-2" />
              <h3 className="font-medium">No stocks in your watchlist</h3>
              <p className="text-aura-secondary-text text-sm mt-1 mb-3">
                Add stocks to keep track of your investments
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/market">Browse Stocks</Link>
              </Button>
            </Card> : <Card className="financial-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-aura-medium-gray">Symbol</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-aura-medium-gray">Name</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-aura-medium-gray">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-aura-medium-gray">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchlist.map(stock => <tr key={stock.id} className="border-b border-gray-800 hover:bg-gray-900/30">
                        <td className="px-4 py-3 text-sm font-medium">{stock.symbol}</td>
                        <td className="px-4 py-3 text-sm text-aura-silver-gray">{stock.name}</td>
                        <td className="px-4 py-3 text-sm text-right">{formatCurrency(stock.price)}</td>
                        <td className={`px-4 py-3 text-sm text-right ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <div className="flex items-center justify-end">
                            {stock.change >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                            {formatPercentage(stock.changePercent)}
                          </div>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </Card>}
        </div>
      </section>

      {/* Insights */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-aura-primary-text">AI Insights</h2>
          <Link to="/insights" className="text-sm text-aura-gold flex items-center hover:text-aura-bright-gold">
            All Insights <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4">
          {currentInsights.map(insight => <Card key={insight.id} className="financial-card">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${insight.type === 'cost-saving' ? 'bg-red-900/30 text-red-400' : insight.type === 'investment' ? 'bg-blue-900/30 text-aura-chart-blue' : 'bg-yellow-900/30 text-yellow-500'}`}>
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-aura-primary-text">{insight.title}</h3>
                    <p className="text-sm text-aura-secondary-text mt-1">{insight.description}</p>
                    
                    {insight.potentialSavings && <div className="mt-2 text-sm font-medium text-aura-gold">
                        Potential savings: {insight.potentialSavings}
                      </div>}
                    
                    {insight.potentialReturn && <div className="mt-2 text-sm font-medium text-aura-chart-blue">
                        Potential return: {insight.potentialReturn}
                      </div>}
                    
                    {insight.relatedStocks && <div className="mt-2 text-sm">
                        <span className="text-aura-secondary-text">Related: </span>
                        {insight.relatedStocks.join(", ")}
                      </div>}
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </section>
    </div>;
};
export default Dashboard;
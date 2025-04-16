import { Card, CardContent } from "@/components/ui/card";
import { mockInsights, mockStocks } from "@/utils/mockData";
import { AlertCircle, BarChart3, BookmarkPlus, ChevronRight, CircleDollarSign, DollarSign, Lightbulb, PiggyBank, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
const Insights = () => {
  return <div className="container px-4 py-6 animate-fade-in bg-gray-900">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-aura-primary-text">
          Insights
        </h1>
        <p className="text-aura-secondary-text">
          AI-powered financial tips and suggestions
        </p>
      </header>

      {/* Insights Feed */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-aura-primary-text">Your Financial Insights</h2>
        
        <div className="space-y-4">
          {/* Cost Saving Insight */}
          <Card className="financial-card bg-amber-300 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex">
                <div className="p-3 rounded-full mr-4 bg-red-900">
                  <Lightbulb className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-xs px-2 py-1 bg-red-900/30 rounded-full mr-2 text-red-600">
                      Cost Saving
                    </span>
                    <span className="text-xs text-aura-medium-gray text-gray-950">April 6, 2025</span>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2 text-aura-primary-text text-gray-950">Reduce Food Expenses</h3>
                  <p className="text-aura-secondary-text mb-3 text-gray-950">
                    Your food spending is trending 15% higher than last month. Consider meal planning to reduce costs.
                  </p>
                  
                  <div className="flex items-center text-aura-gold font-medium mb-4 bg-[aura-chart-green] bg-green-600 px-0 rounded-none">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Potential savings: $90/month
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      View Details <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Opportunity */}
          <Card className="financial-card bg-sky-200 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex">
                <div className="bg-blue-900/30 p-3 rounded-full mr-4">
                  <PiggyBank className="h-6 w-6 text-aura-chart-blue px-0" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="px-2 py-1 bg-blue-900/30 text-aura-chart-blue rounded-full mr-2 text-xs">
                      Investment
                    </span>
                    <span className="text-xs text-aura-medium-gray text-gray-950">April 6, 2025</span>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2 text-aura-primary-text text-zinc-950">Investment Opportunity</h3>
                  <p className="text-aura-secondary-text mb-3 text-zinc-950">
                    Based on your current savings, you could invest $500 in index funds this month without impacting your emergency fund.
                  </p>
                  
                  <div className="p-3 rounded-md mb-4 bg-blue-950">
                    <div className="text-aura-primary-text font-medium mb-1 bg-transparent">Potential Outcomes</div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-aura-secondary-text">1 Year:</span>
                        <span className="ml-1 text-aura-gold">+$40 (8%)</span>
                      </div>
                      <div>
                        <span className="text-aura-secondary-text">5 Years:</span>
                        <span className="ml-1 text-aura-gold">+$234 (47%)</span>
                      </div>
                      <div>
                        <span className="text-aura-secondary-text">10 Years:</span>
                        <span className="ml-1 text-aura-gold">+$594 (119%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="rounded-2xl">
                      Learn More <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Alert */}
          <Card className="financial-card bg-yellow-600 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex">
                <div className="p-3 rounded-full mr-4 bg-yellow-900">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-xs px-2 py-1 bg-yellow-900/30 text-yellow-500 rounded-full mr-2">
                      Market Alert
                    </span>
                    <span className="text-xs text-aura-medium-gray text-gray-950">April 6, 2025</span>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2 text-aura-primary-text">Technology Sector Trending Up</h3>
                  <p className="text-aura-secondary-text mb-3">
                    The technology sector has risen 3.2% this week. Your watchlist stocks in this sector are performing well.
                  </p>
                  
                  <div className="bg-gray-800/50 p-3 rounded-md mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium mr-2 text-aura-primary-text">AAPL</span>
                        <span className="text-sm text-aura-medium-gray">Apple Inc.</span>
                      </div>
                      <div className="flex items-center text-green-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+0.67%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium mr-2 text-aura-primary-text">MSFT</span>
                        <span className="text-sm text-aura-medium-gray">Microsoft Corp.</span>
                      </div>
                      <div className="flex items-center text-green-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+0.79%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="rounded-2xl">
                      View Sector <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center rounded-2xl">
                      <BookmarkPlus className="h-4 w-4 mr-1" /> Watch Tech Stocks
                    </Button>
                    <Button variant="ghost" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Health */}
          <Card className="financial-card bg-green-400 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex">
                <div className="p-3 rounded-full mr-4 bg-green-900">
                  <BarChart3 className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded-full mr-2">
                      Financial Health
                    </span>
                    <span className="text-xs text-aura-medium-gray text-gray-950">April 6, 2025</span>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2 text-aura-primary-text">Your Financial Health Score: B+</h3>
                  <p className="text-aura-secondary-text mb-3">
                    Your savings rate has improved to 28% this month, but your emergency fund could use some attention.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-md bg-gray-800">
                      <div className="text-sm text-aura-medium-gray bg-transparent">Strengths</div>
                      <ul className="text-sm mt-1 space-y-1 text-aura-primary-text">
                        <li className="flex items-start">
                          <div className="text-green-400 mr-1">✓</div>
                          Strong savings rate
                        </li>
                        <li className="flex items-start">
                          <div className="text-green-400 mr-1">✓</div>
                          Consistent income
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-3 rounded-md bg-gray-800">
                      <div className="text-sm text-aura-medium-gray">Areas to Improve</div>
                      <ul className="text-sm mt-1 space-y-1 text-aura-primary-text">
                        <li className="flex items-start">
                          <div className="text-yellow-500 mr-1">!</div>
                          Low emergency fund
                        </li>
                        <li className="flex items-start">
                          <div className="text-yellow-500 mr-1">!</div>
                          No retirement contributions
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="rounded-2xl">
                      View Full Report <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Educational Tip */}
          <Card className="financial-card bg-violet-500 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex">
                <div className="p-3 rounded-full mr-4 bg-purple-900">
                  <CircleDollarSign className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-xs px-2 py-1 bg-purple-900/30 text-purple-400 rounded-full mr-2">
                      Education
                    </span>
                    <span className="text-xs text-aura-medium-gray text-gray-950">April 6, 2025</span>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2 text-aura-primary-text">Understanding Dollar-Cost Averaging</h3>
                  <p className="text-aura-secondary-text mb-3">
                    Dollar-cost averaging is an investment strategy that can help reduce the impact of volatility on your investments.
                  </p>
                  
                  <div className="p-3 rounded-md mb-4 text-sm bg-gray-800">
                    <p className="mb-2 text-aura-primary-text">
                      <strong>How it works:</strong> Instead of investing a large amount at once, you invest smaller amounts at regular intervals regardless of price.
                    </p>
                    <p className="text-aura-primary-text">
                      <strong>Benefits:</strong> Reduces risk from market timing, creates investing discipline, and potentially lowers average cost per share over time.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="rounded-2xl">
                      Learn More <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-yellow-900/30 border border-yellow-800/50 p-4 text-sm flex items-start rounded-2xl">
        <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-yellow-400 mb-1">Important Disclaimer</p>
          <p className="text-yellow-300">
            The insights provided are based on your data and market analysis but are not professional financial advice. 
            Always do your own research or consult a certified financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>;
};
export default Insights;

import { Card, CardContent } from "@/components/ui/card";
import { mockInsights, mockStocks } from "@/utils/mockData";
import { 
  AlertCircle,
  BarChart3,
  BookmarkPlus,
  ChevronRight,
  CircleDollarSign,
  DollarSign,
  Lightbulb,
  PiggyBank,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Insights = () => {
  return (
    <div className="container px-4 py-6 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-finance-text-primary">
          Insights
        </h1>
        <p className="text-finance-text-secondary">
          AI-powered financial tips and suggestions
        </p>
      </header>

      {/* Insights Feed */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-finance-text-primary">Your Financial Insights</h2>
        
        <div className="space-y-4">
          {/* Cost Saving Insight */}
          <Card className="financial-card">
            <CardContent className="p-4">
              <div className="flex">
                <div className="bg-red-50 p-3 rounded-full mr-4">
                  <Lightbulb className="h-6 w-6 text-finance-danger" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-xs px-2 py-1 bg-red-50 text-finance-danger rounded-full mr-2">
                      Cost Saving
                    </span>
                    <span className="text-xs text-finance-text-tertiary">April 6, 2025</span>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2">Reduce Food Expenses</h3>
                  <p className="text-finance-text-secondary mb-3">
                    Your food spending is trending 15% higher than last month. Consider meal planning to reduce costs.
                  </p>
                  
                  <div className="flex items-center text-finance-accent font-medium mb-4">
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
          <Card className="financial-card">
            <CardContent className="p-4">
              <div className="flex">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <PiggyBank className="h-6 w-6 text-finance-primary" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-finance-primary rounded-full mr-2">
                      Investment
                    </span>
                    <span className="text-xs text-finance-text-tertiary">April 6, 2025</span>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2">Investment Opportunity</h3>
                  <p className="text-finance-text-secondary mb-3">
                    Based on your current savings, you could invest $500 in index funds this month without impacting your emergency fund.
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <div className="text-finance-text-primary font-medium mb-1">Potential Outcomes</div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-finance-text-secondary">1 Year:</span>
                        <span className="ml-1 text-finance-accent">+$40 (8%)</span>
                      </div>
                      <div>
                        <span className="text-finance-text-secondary">5 Years:</span>
                        <span className="ml-1 text-finance-accent">+$234 (47%)</span>
                      </div>
                      <div>
                        <span className="text-finance-text-secondary">10 Years:</span>
                        <span className="ml-1 text-finance-accent">+$594 (119%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
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
          <Card className="financial-card">
            <CardContent className="p-4">
              <div className="flex">
                <div className="bg-yellow-50 p-3 rounded-full mr-4">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full mr-2">
                      Market Alert
                    </span>
                    <span className="text-xs text-finance-text-tertiary">April 6, 2025</span>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2">Technology Sector Trending Up</h3>
                  <p className="text-finance-text-secondary mb-3">
                    The technology sector has risen 3.2% this week. Your watchlist stocks in this sector are performing well.
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">AAPL</span>
                        <span className="text-sm text-finance-text-tertiary">Apple Inc.</span>
                      </div>
                      <div className="flex items-center text-finance-accent">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+0.67%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">MSFT</span>
                        <span className="text-sm text-finance-text-tertiary">Microsoft Corp.</span>
                      </div>
                      <div className="flex items-center text-finance-accent">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+0.79%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      View Sector <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button size="sm" className="flex items-center" variant="outline">
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
          <Card className="financial-card">
            <CardContent className="p-4">
              <div className="flex">
                <div className="bg-green-50 p-3 rounded-full mr-4">
                  <BarChart3 className="h-6 w-6 text-finance-accent" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-xs px-2 py-1 bg-green-50 text-finance-accent rounded-full mr-2">
                      Financial Health
                    </span>
                    <span className="text-xs text-finance-text-tertiary">April 6, 2025</span>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2">Your Financial Health Score: B+</h3>
                  <p className="text-finance-text-secondary mb-3">
                    Your savings rate has improved to 28% this month, but your emergency fund could use some attention.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-finance-text-tertiary">Strengths</div>
                      <ul className="text-sm mt-1 space-y-1">
                        <li className="flex items-start">
                          <div className="text-green-500 mr-1">✓</div>
                          Strong savings rate
                        </li>
                        <li className="flex items-start">
                          <div className="text-green-500 mr-1">✓</div>
                          Consistent income
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-finance-text-tertiary">Areas to Improve</div>
                      <ul className="text-sm mt-1 space-y-1">
                        <li className="flex items-start">
                          <div className="text-amber-500 mr-1">!</div>
                          Low emergency fund
                        </li>
                        <li className="flex items-start">
                          <div className="text-amber-500 mr-1">!</div>
                          No retirement contributions
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
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
          <Card className="financial-card">
            <CardContent className="p-4">
              <div className="flex">
                <div className="bg-purple-50 p-3 rounded-full mr-4">
                  <CircleDollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full mr-2">
                      Education
                    </span>
                    <span className="text-xs text-finance-text-tertiary">April 6, 2025</span>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2">Understanding Dollar-Cost Averaging</h3>
                  <p className="text-finance-text-secondary mb-3">
                    Dollar-cost averaging is an investment strategy that can help reduce the impact of volatility on your investments.
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm">
                    <p className="mb-2">
                      <strong>How it works:</strong> Instead of investing a large amount at once, you invest smaller amounts at regular intervals regardless of price.
                    </p>
                    <p>
                      <strong>Benefits:</strong> Reduces risk from market timing, creates investing discipline, and potentially lowers average cost per share over time.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
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
      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-yellow-800 mb-1">Important Disclaimer</p>
          <p className="text-yellow-700">
            The insights provided are based on your data and market analysis but are not professional financial advice. 
            Always do your own research or consult a certified financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Insights;

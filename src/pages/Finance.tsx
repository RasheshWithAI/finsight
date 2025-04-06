
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockTransactions, mockBudgets } from "@/utils/mockData";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  BarChart3, 
  Calendar, 
  Filter, 
  PieChart, 
  Plus, 
  RefreshCw 
} from "lucide-react";

const Finance = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [budgets, setBudgets] = useState(mockBudgets);

  // Format currency function
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate percentage for budget progress bars
  const calculatePercentage = (spent: number, budgeted: number) => {
    return Math.min(Math.round((spent / budgeted) * 100), 100);
  };

  return (
    <div className="container px-4 py-6 animate-fade-in">
      <header className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-finance-text-primary">Finance</h1>
          <p className="text-finance-text-secondary">
            Track your income, expenses and budgets
          </p>
        </div>
        <Button className="bg-finance-primary hover:bg-finance-secondary mt-2 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" /> Add Transaction
        </Button>
      </header>

      {/* Financial Summary */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-finance-text-primary">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="financial-card">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="stat-label">Income</span>
                <ArrowUpCircle className="h-4 w-4 text-finance-accent" />
              </div>
              <span className="stat-value mt-2">{formatCurrency(totalIncome)}</span>
            </CardContent>
          </Card>
          
          <Card className="financial-card">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="stat-label">Expenses</span>
                <ArrowDownCircle className="h-4 w-4 text-finance-danger" />
              </div>
              <span className="stat-value mt-2">{formatCurrency(totalExpenses)}</span>
            </CardContent>
          </Card>
          
          <Card className="financial-card">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="stat-label">Balance</span>
                <BarChart3 className="h-4 w-4 text-finance-primary" />
              </div>
              <span className="stat-value mt-2">{formatCurrency(totalIncome - totalExpenses)}</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tabs for Transactions and Budgets */}
      <Tabs defaultValue="transactions">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button variant="outline" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> April 2025
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <Card className="financial-card overflow-hidden">
            {transactions.length === 0 ? (
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <BarChart3 className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                <p className="text-finance-text-secondary mb-4">
                  Start by adding your income and expenses
                </p>
                <Button>Add First Transaction</Button>
              </CardContent>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-finance-text-tertiary">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-finance-text-tertiary">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-finance-text-tertiary">Category</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-finance-text-tertiary">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{transaction.date}</td>
                        <td className="px-4 py-3 text-sm">{transaction.description}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                            {transaction.category}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-sm font-medium text-right ${
                          transaction.type === 'income' ? 'text-finance-accent' : 'text-finance-danger'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
        
        {/* Budgets Tab */}
        <TabsContent value="budgets">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button variant="outline" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> April 2025
            </Button>
            <div className="grow"></div>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Budget
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {budgets.map((budget) => (
              <Card key={budget.id} className="financial-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{budget.category}</h3>
                  <span className="text-sm text-finance-text-secondary">{budget.period}</span>
                </div>
                
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Spent: {formatCurrency(budget.spent)}</span>
                    <span>Budgeted: {formatCurrency(budget.budgeted)}</span>
                  </div>
                  <Progress 
                    value={calculatePercentage(budget.spent, budget.budgeted)}
                    className={`h-2 ${budget.spent > budget.budgeted ? 'bg-finance-danger' : ''}`}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-finance-text-tertiary">
                    {formatCurrency(budget.budgeted - budget.spent)} left
                  </span>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Category Breakdown Chart Card */}
          <Card className="financial-card p-6 mt-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-base flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0 flex justify-center">
              <div className="text-center p-8">
                <p className="text-finance-text-secondary">Chart component would be here</p>
                <p className="text-xs text-finance-text-tertiary mt-1">
                  This is a placeholder for a real chart visualization
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;

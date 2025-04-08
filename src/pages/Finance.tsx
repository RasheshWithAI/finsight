import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockTransactions, mockBudgets } from "@/utils/mockData";
import { ArrowDownCircle, ArrowUpCircle, BarChart3, Calendar, Filter, PieChart, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import ExpensePieChart from "@/components/charts/ExpensePieChart";
import BudgetBarChart from "@/components/charts/BudgetBarChart";
const Finance = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [budgets, setBudgets] = useState(mockBudgets);
  const [selectedMonth, setSelectedMonth] = useState("April 2025");

  // Format currency function
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  // Calculate percentage for budget progress bars
  const calculatePercentage = (spent: number, budgeted: number) => {
    return Math.min(Math.round(spent / budgeted * 100), 100);
  };
  const handleAddTransaction = () => {
    toast.success("Transaction feature coming soon!");
  };
  const handleNewBudget = () => {
    toast.success("Budget creation feature coming soon!");
  };
  return <div className="container px-4 py-6 animate-fade-in">
      <header className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-aura-primary-text">Finance</h1>
          <p className="text-aura-secondary-text">
            Track your income, expenses and budgets
          </p>
        </div>
        <Button className="bg-accent-gradient hover:brightness-105 mt-2 sm:mt-0 text-aura-dark-gray" onClick={handleAddTransaction}>
          <Plus className="h-4 w-4 mr-2" /> Add Transaction
        </Button>
      </header>

      {/* Financial Summary */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-aura-primary-text">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="financial-card bg-green-600">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="stat-label text-amber-400">Income</span>
                <ArrowUpCircle className="h-4 w-4 text-green-400" />
              </div>
              <span className="stat-value mt-2 text-aura-gold">{formatCurrency(totalIncome)}</span>
            </CardContent>
          </Card>
          
          <Card className="financial-card bg-violet-800">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between bg-transparent">
                <span className="stat-label bg-violet-900 hover:bg-violet-800 text-slate-50 font-normal">Expenses</span>
                <ArrowDownCircle className="h-4 w-4 text-red-400" />
              </div>
              <span className="stat-value mt-2 text-aura-primary-text">{formatCurrency(totalExpenses)}</span>
            </CardContent>
          </Card>
          
          <Card className="financial-card bg-amber-500">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="stat-label text-base text-yellow-950">Balance</span>
                <BarChart3 className="h-4 w-4 text-aura-chart-blue" />
              </div>
              <span className="stat-value mt-2 text-aura-gold">{formatCurrency(totalIncome - totalExpenses)}</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tabs for Transactions and Budgets */}
      <Tabs defaultValue="transactions">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="transactions" className="rounded-3xl bg-purple-900 hover:bg-purple-800">Transactions</TabsTrigger>
          <TabsTrigger value="budgets" className="rounded-3xl bg-purple-900 hover:bg-purple-800">Budgets</TabsTrigger>
        </TabsList>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button variant="outline" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> {selectedMonth}
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <Card className="financial-card overflow-hidden">
            {transactions.length === 0 ? <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <BarChart3 className="h-12 w-12 text-aura-medium-gray" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-aura-primary-text">No transactions yet</h3>
                <p className="text-aura-secondary-text mb-4">
                  Start by adding your income and expenses
                </p>
                <Button onClick={handleAddTransaction}>Add First Transaction</Button>
              </CardContent> : <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-aura-medium-gray">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-aura-medium-gray">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-aura-medium-gray">Category</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-aura-medium-gray">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(transaction => <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-900/30">
                        <td className="px-4 py-3 text-sm text-aura-primary-text">{transaction.date}</td>
                        <td className="px-4 py-3 text-sm text-aura-primary-text">{transaction.description}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-800 text-aura-silver-gray">
                            {transaction.category}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-sm font-medium text-right ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>}
          </Card>

          {/* Expense Breakdown Chart */}
          <Card className="financial-card p-6 mt-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-base flex items-center">
                <PieChart className="h-4 w-4 mr-2 text-aura-gold" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <div className="h-64">
                <ExpensePieChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Budgets Tab */}
        <TabsContent value="budgets">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button variant="outline" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> {selectedMonth}
            </Button>
            <div className="grow"></div>
            <Button className="bg-accent-gradient hover:brightness-105 text-aura-dark-gray" onClick={handleNewBudget}>
              <Plus className="h-4 w-4 mr-2" /> New Budget
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {budgets.map(budget => <Card key={budget.id} className="financial-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-aura-primary-text">{budget.category}</h3>
                  <span className="text-sm text-aura-medium-gray">{budget.period}</span>
                </div>
                
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-aura-primary-text">Spent: {formatCurrency(budget.spent)}</span>
                    <span className="text-aura-primary-text">Budgeted: {formatCurrency(budget.budgeted)}</span>
                  </div>
                  <Progress value={calculatePercentage(budget.spent, budget.budgeted)} className={`h-2 ${budget.spent > budget.budgeted ? 'bg-red-400' : ''}`} />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-aura-medium-gray">
                    {formatCurrency(budget.budgeted - budget.spent)} left
                  </span>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </Card>)}
          </div>
          
          {/* Budget Comparison Chart */}
          <Card className="financial-card p-6 mt-6 bg-green-50">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-base flex items-center text-gray-950">
                <BarChart3 className="h-4 w-4 mr-2 text-aura-gold" />
                Budget vs Actual Spending
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <div className="h-64">
                <BudgetBarChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default Finance;
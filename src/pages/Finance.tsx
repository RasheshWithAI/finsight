
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowDownCircle, ArrowUpCircle, BarChart3, Calendar, Filter, PieChart, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import ExpensePieChart from "@/components/charts/ExpensePieChart";
import BudgetBarChart from "@/components/charts/BudgetBarChart";
import AddTransactionForm from "@/components/finance/AddTransactionForm";
import { formatCurrency } from "@/utils/currencyUtils";

// Helper function to calculate percentage for progress bar
const calculatePercentage = (spent: number, budgeted: number): number => {
  if (budgeted === 0) return 0;
  const percentage = (spent / budgeted) * 100;
  return Math.min(percentage, 100); // Cap at 100% for progress bar display
};

const Finance = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("April 2025");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  // Calculate totals from actual transactions
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  const handleAddTransaction = () => {
    setIsAddTransactionOpen(true);
  };

  const handleSaveTransaction = (transaction: any) => {
    setTransactions([transaction, ...transactions]);
    toast.success("Transaction added successfully!");
  };

  const handleNewBudget = () => {
    toast.success("Budget creation feature coming soon!");
  };

  return (
    <div className="container px-4 py-6 animate-fade-in bg-gray-900">
      <header className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-aura-primary-text">Finance</h1>
          <p className="text-aura-secondary-text">
            Track your income, expenses and budgets
          </p>
        </div>
        <Button onClick={handleAddTransaction} className="bg-accent-gradient hover:brightness-105 mt-2 sm:mt-0 text-aura-dark-gray rounded-2xl">
          <Plus className="h-4 w-4 mr-2" /> Add Transaction
        </Button>
      </header>

      {/* Add Transaction Dialog */}
      <AddTransactionForm 
        isOpen={isAddTransactionOpen} 
        onClose={() => setIsAddTransactionOpen(false)} 
        onSave={handleSaveTransaction} 
      />

      {/* Financial Summary */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-aura-primary-text">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="financial-card bg-green-600 rounded-2xl">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="stat-label text-yellow-400">Income</span>
                <ArrowUpCircle className="h-4 w-4 text-green-400" />
              </div>
              <span className="stat-value mt-2 text-aura-gold text-yellow-400">
                {transactions.length > 0 ? formatCurrency(totalIncome) : "No income recorded"}
              </span>
            </CardContent>
          </Card>
          
          <Card className="financial-card bg-violet-800 rounded-2xl">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between bg-transparent">
                <span className="stat-label bg-violet-900 hover:bg-violet-800 font-normal text-slate-50">Expenses</span>
                <ArrowDownCircle className="h-4 w-4 text-red-400" />
              </div>
              <span className="stat-value mt-2 text-aura-primary-text">
                {transactions.length > 0 ? formatCurrency(totalExpenses) : "No expenses recorded"}
              </span>
            </CardContent>
          </Card>
          
          <Card className="financial-card bg-amber-500 rounded-2xl">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="stat-label text-base text-lime-50">Balance</span>
                <BarChart3 className="h-4 w-4 text-aura-chart-blue" />
              </div>
              <span className="stat-value mt-2 text-aura-gold text-lime-50">
                {transactions.length > 0 ? formatCurrency(totalIncome - totalExpenses) : "No transactions recorded"}
              </span>
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
          
          <Card className="financial-card overflow-hidden bg-gray-600 rounded-2xl">
            {transactions.length === 0 ? (
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <BarChart3 className="h-12 w-12 text-aura-medium-gray" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-aura-primary-text">No transactions yet</h3>
                <p className="text-aura-secondary-text mb-4">
                  Start by adding your income and expenses
                </p>
                <Button onClick={handleAddTransaction}>Add First Transaction</Button>
              </CardContent>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-aura-medium-gray bg-transparent">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-aura-medium-gray">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-aura-medium-gray">Category</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-aura-medium-gray">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(transaction => (
                      <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-900/30">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Expense Breakdown Chart */}
          <Card className="financial-card p-6 mt-6 rounded-2xl">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-base flex items-center">
                <PieChart className="h-4 w-4 mr-2 text-aura-gold" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              {transactions.length > 0 ? (
                <div className="h-64">
                  <ExpensePieChart transactions={transactions} />
                </div>
              ) : (
                <div className="text-center py-8 text-aura-secondary-text">
                  No expense data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Budgets Tab */}
        <TabsContent value="budgets">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button variant="outline" className="flex items-center rounded-2xl">
              <Calendar className="h-4 w-4 mr-2" /> {selectedMonth}
            </Button>
            <div className="grow"></div>
            <Button onClick={handleNewBudget} className="bg-accent-gradient hover:brightness-105 text-aura-dark-gray rounded-2xl">
              <Plus className="h-4 w-4 mr-2" /> New Budget
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {budgets.length === 0 ? (
              <Card className="financial-card p-8 text-center col-span-2">
                <div className="flex justify-center mb-4">
                  <BarChart3 className="h-12 w-12 text-aura-medium-gray" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-aura-primary-text">No budgets set</h3>
                <p className="text-aura-secondary-text mb-4">
                  Create your first budget to start tracking your spending
                </p>
                <Button onClick={handleNewBudget}>Create First Budget</Button>
              </Card>
            ) : (
              budgets.map(budget => (
                <Card key={budget.id} className="financial-card p-4 rounded-2xl">
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
                </Card>
              ))
            )}
          </div>
          
          {/* Budget Comparison Chart */}
          <Card className="financial-card p-6 mt-6 rounded-2xl bg-fuchsia-200">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-base flex items-center text-gray-950">
                <BarChart3 className="h-4 w-4 mr-2 text-aura-gold" />
                Budget vs Actual Spending
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              {budgets.length > 0 ? (
                <div className="h-64">
                  <BudgetBarChart />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  No budget data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;

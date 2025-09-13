"use client";

import { useCallback, useEffect, useState } from "react";
import { useMiniApp } from "@neynar/react";
import { Header } from "~/components/ui/Header";
import { NavigationBar } from "~/components/ui/NavigationBar";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { MetaMaskConnector } from "~/components/ui/MetaMaskConnector";
import SmartContractIntegration from "~/components/SmartContractIntegration";

export type Tab = "dashboard" | "goals" | "expenses" | "analytics";

interface DailyGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  date: string;
}

interface MainGoal {
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'food' | 'transport' | 'entertainment' | 'utilities' | 'other';
  date: string;
}

interface FinancialData {
  dailyGoals: DailyGoal[];
  mainGoal: MainGoal;
  expenses: Expense[];
  totalBudget: number;
}

export default function MoneySaver() {
  const { isSDKLoaded, context } = useMiniApp();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [data, setData] = useState<FinancialData>({
    dailyGoals: [
      {
        id: '1',
        title: 'Coffee Budget',
        targetAmount: 10,
        currentAmount: 7,
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '2',
        title: 'Lunch Savings',
        targetAmount: 25,
        currentAmount: 15,
        date: new Date().toISOString().split('T')[0]
      }
    ],
    mainGoal: {
      title: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 1250,
      deadline: '2024-12-31'
    },
    expenses: [
      {
        id: '1',
        title: 'Morning Coffee',
        amount: 4.50,
        category: 'food',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '2',
        title: 'Bus Fare',
        amount: 2.75,
        category: 'transport',
        date: new Date().toISOString().split('T')[0]
      }
    ],
    totalBudget: 2000
  });

  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'other' as Expense['category']
  });

  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    type: 'daily' as 'daily' | 'main'
  });

  // Calculate statistics
  const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSaved = data.totalBudget - totalExpenses;
  const savingsPercentage = ((totalSaved / data.totalBudget) * 100).toFixed(1);
  const profitLoss = totalSaved;
  const mainGoalProgress = ((data.mainGoal.currentAmount / data.mainGoal.targetAmount) * 100).toFixed(1);

  const addExpense = useCallback(() => {
    if (newExpense.title && newExpense.amount) {
      const expense: Expense = {
        id: Date.now().toString(),
        title: newExpense.title,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: new Date().toISOString().split('T')[0]
      };
      
      setData(prev => ({
        ...prev,
        expenses: [...prev.expenses, expense]
      }));
      
      setNewExpense({ title: '', amount: '', category: 'other' });
    }
  }, [newExpense]);

  const addGoal = useCallback(() => {
    if (newGoal.title && newGoal.targetAmount) {
      if (newGoal.type === 'daily') {
        const goal: DailyGoal = {
          id: Date.now().toString(),
          title: newGoal.title,
          targetAmount: parseFloat(newGoal.targetAmount),
          currentAmount: 0,
          date: new Date().toISOString().split('T')[0]
        };
        
        setData(prev => ({
          ...prev,
          dailyGoals: [...prev.dailyGoals, goal]
        }));
      } else {
        setData(prev => ({
          ...prev,
          mainGoal: {
            ...prev.mainGoal,
            title: newGoal.title,
            targetAmount: parseFloat(newGoal.targetAmount)
          }
        }));
      }
      
      setNewGoal({ title: '', targetAmount: '', type: 'daily' });
    }
  }, [newGoal]);

  const updateGoalProgress = useCallback((goalId: string, amount: number) => {
    setData(prev => ({
      ...prev,
      dailyGoals: prev.dailyGoals.map(goal =>
        goal.id === goalId
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
          : goal
      )
    }));
  }, []);

  if (!isSDKLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="mx-auto py-2 px-4 pb-20">
        <Header />

        <h1 className="text-2xl font-bold text-center mb-4">💰 Money Saver</h1>

        {activeTab === "dashboard" && (
          <div className="space-y-4 px-6 w-full max-w-md mx-auto">
            {/* Financial Overview */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h2 className="text-lg font-semibold mb-3 text-foreground">Financial Overview</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${totalSaved.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Total Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{savingsPercentage}%</div>
                  <div className="text-xs text-muted-foreground">Savings Rate</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(profitLoss).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {profitLoss >= 0 ? 'Profit' : 'Loss'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">${totalExpenses.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Total Spent</div>
                </div>
              </div>
            </div>

            {/* MetaMask Wallet Connection */}
            <MetaMaskConnector />

            {/* Smart Contract Integration */}
            <SmartContractIntegration />

            {/* Main Goal Progress */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2 text-foreground">{data.mainGoal.title}</h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(parseFloat(mainGoalProgress), 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>${data.mainGoal.currentAmount}</span>
                <span>{mainGoalProgress}%</span>
                <span>${data.mainGoal.targetAmount}</span>
              </div>
            </div>

            {/* Daily Goals Summary */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-3 text-foreground">Today's Goals</h3>
              <div className="space-y-2">
                {data.dailyGoals.map(goal => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <div key={goal.id} className="flex items-center justify-between">
                      <span className="text-sm">{goal.title}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ${goal.currentAmount}/${goal.targetAmount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "goals" && (
          <div className="space-y-4 px-6 w-full max-w-md mx-auto">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h2 className="text-lg font-semibold mb-3 text-foreground">Add New Goal</h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Save for vacation"
                  />
                </div>
                <div>
                  <Label htmlFor="goal-amount">Target Amount ($)</Label>
                  <Input
                    id="goal-amount"
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="goal-type">Goal Type</Label>
                  <select
                    id="goal-type"
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={newGoal.type}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value as 'daily' | 'main' }))}
                  >
                    <option value="daily">Daily Goal</option>
                    <option value="main">Main Goal</option>
                  </select>
                </div>
                <Button onClick={addGoal} className="w-full">
                  Add Goal
                </Button>
              </div>
            </div>

            {/* Daily Goals Management */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-3 text-foreground">Daily Goals</h3>
              <div className="space-y-3">
                {data.dailyGoals.map(goal => (
                  <div key={goal.id} className="border border-border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{goal.title}</span>
                      <span className="text-sm text-muted-foreground">
                        ${goal.currentAmount}/${goal.targetAmount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => updateGoalProgress(goal.id, 1)}
                        className="flex-1 text-xs py-1"
                      >
                        +$1
                      </Button>
                      <Button
                        onClick={() => updateGoalProgress(goal.id, 5)}
                        className="flex-1 text-xs py-1"
                      >
                        +$5
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="space-y-4 px-6 w-full max-w-md mx-auto">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h2 className="text-lg font-semibold mb-3 text-foreground">Add Expense</h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="expense-title">Expense Title</Label>
                  <Input
                    id="expense-title"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Coffee"
                  />
                </div>
                <div>
                  <Label htmlFor="expense-amount">Amount ($)</Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="expense-category">Category</Label>
                  <select
                    id="expense-category"
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value as Expense['category'] }))}
                  >
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="utilities">Utilities</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Button onClick={addExpense} className="w-full">
                  Add Expense
                </Button>
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-3 text-foreground">Recent Expenses</h3>
              <div className="space-y-2">
                {data.expenses.slice(-5).reverse().map(expense => (
                  <div key={expense.id} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                    <div>
                      <div className="font-medium">{expense.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">{expense.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600">-${expense.amount.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{expense.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4 px-6 w-full max-w-md mx-auto">
            {/* Expense Breakdown */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h2 className="text-lg font-semibold mb-3 text-foreground">Expense Breakdown</h2>
              <div className="space-y-2">
                {['food', 'transport', 'entertainment', 'utilities', 'other'].map(category => {
                  const categoryExpenses = data.expenses.filter(e => e.category === category);
                  const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                  const percentage = totalExpenses > 0 ? ((categoryTotal / totalExpenses) * 100).toFixed(1) : '0';
                  
                  return (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm w-16 text-right">${categoryTotal.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground w-10 text-right">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Savings Progress */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-3 text-foreground">Savings Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Monthly Budget:</span>
                  <span className="font-medium">${data.totalBudget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Spent:</span>
                  <span className="font-medium text-red-600">${totalExpenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className={`font-medium ${totalSaved >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${totalSaved.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Savings Rate:</span>
                  <span className="font-medium text-blue-600">{savingsPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
                  <div 
                    className={`h-4 rounded-full transition-all duration-300 ${
                      parseFloat(savingsPercentage) >= 20 ? 'bg-green-600' : 
                      parseFloat(savingsPercentage) >= 10 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(Math.max(parseFloat(savingsPercentage), 0), 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-2">
                  {parseFloat(savingsPercentage) >= 20 ? 'Excellent savings!' : 
                   parseFloat(savingsPercentage) >= 10 ? 'Good progress!' : 'Try to save more!'}
                </div>
              </div>
            </div>
          </div>
        )}

        <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
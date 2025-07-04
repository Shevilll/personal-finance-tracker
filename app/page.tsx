"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import { MonthlyChart } from "@/components/monthly-chart";
import { CategoryPieChart } from "@/components/category-pie-chart";
import { BudgetVsActualChart } from "@/components/budget-vs-actual-chart";
import { SummaryCards } from "@/components/summary-cards";
import { BudgetOverview } from "@/components/budget-overview";
import { BudgetManager } from "@/components/budget-manager";
import { SpendingInsights } from "@/components/spending-insights";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBudgetUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6 max-w-7xl">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Personal Finance Tracker
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track expenses, set budgets, and get insights on your spending
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <BudgetManager onBudgetUpdate={handleBudgetUpdate} />
          </div>
        </div>

        {/* Summary Cards - Responsive Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          }
        >
          <SummaryCards refreshTrigger={refreshTrigger} />
        </Suspense>

        {/* Budget Overview and Insights - Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Suspense fallback={<Skeleton className="h-[300px]" />}>
            <BudgetOverview refreshTrigger={refreshTrigger} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[300px]" />}>
            <SpendingInsights refreshTrigger={refreshTrigger} />
          </Suspense>
        </div>

        {/* Form and Charts - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Transaction Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Add Transaction
                </CardTitle>
                <CardDescription className="text-sm">
                  Record a new expense with category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionForm onSuccess={handleTransactionChange} />
              </CardContent>
            </Card>
          </div>

          {/* Charts - Stack on mobile, side by side on larger screens */}
          <div className="lg:col-span-1 xl:col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Monthly Expenses
                </CardTitle>
                <CardDescription className="text-sm">
                  Your spending over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <MonthlyChart refreshTrigger={refreshTrigger} />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Category Breakdown
                </CardTitle>
                <CardDescription className="text-sm">
                  Expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                  <CategoryPieChart refreshTrigger={refreshTrigger} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Budget vs Actual Chart - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Budget vs Actual Spending
            </CardTitle>
            <CardDescription className="text-sm">
              Compare your budgeted amounts with actual spending this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
              <BudgetVsActualChart refreshTrigger={refreshTrigger} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Transaction List - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-sm">
              Your latest financial activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <TransactionList
                onTransactionChange={handleTransactionChange}
                refreshTrigger={refreshTrigger}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

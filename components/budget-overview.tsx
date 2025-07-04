"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getCategoryById } from "@/lib/categories"
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"

interface BudgetProgress {
  category: string
  budgeted: number
  spent: number
  percentage: number
  status: "under" | "near" | "over"
}

interface BudgetOverviewProps {
  refreshTrigger?: number
}

export function BudgetOverview({ refreshTrigger }: BudgetOverviewProps) {
  const [budgetData, setBudgetData] = useState<BudgetProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchBudgetProgress = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true)
      const response = await fetch("/api/budgets/progress", {
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        setBudgetData(data)
      }
    } catch (error) {
      console.error("Error fetching budget progress:", error)
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBudgetProgress()
  }, [fetchBudgetProgress])

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchBudgetProgress(false)
    }
  }, [refreshTrigger, fetchBudgetProgress])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-2 w-full bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (budgetData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No budgets set. Set your first budget to start tracking!
          </p>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "under":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "near":
        return <TrendingUp className="h-4 w-4 text-yellow-500" />
      case "over":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case "under":
        return "bg-green-500"
      case "near":
        return "bg-yellow-500"
      case "over":
        return "bg-red-500"
      default:
        return "bg-primary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgetData.map((budget) => {
            const category = getCategoryById(budget.category)
            return (
              <div key={budget.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                    {getStatusIcon(budget.status)}
                  </div>
                  <Badge variant={budget.status === "over" ? "destructive" : "secondary"}>
                    ${budget.spent.toFixed(2)} / ${budget.budgeted.toFixed(2)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Progress value={Math.min(budget.percentage, 100)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{budget.percentage.toFixed(1)}% used</span>
                    <span>
                      {budget.status === "over"
                        ? `$${(budget.spent - budget.budgeted).toFixed(2)} over`
                        : `$${(budget.budgeted - budget.spent).toFixed(2)} remaining`}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

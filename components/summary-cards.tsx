"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingDown, Calendar, PieChart } from "lucide-react"
import { getCategoryById } from "@/lib/categories"

interface SummaryData {
  totalExpenses: number
  monthlyExpenses: number
  transactionCount: number
  topCategory: {
    category: string
    amount: number
  } | null
}

interface SummaryCardsProps {
  refreshTrigger?: number
}

export function SummaryCards({ refreshTrigger }: SummaryCardsProps) {
  const [data, setData] = useState<SummaryData>({
    totalExpenses: 0,
    monthlyExpenses: 0,
    transactionCount: 0,
    topCategory: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchSummaryData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true)
      const response = await fetch("/api/transactions/summary", {
        cache: "no-store",
      })

      if (response.ok) {
        const summaryData = await response.json()
        setData(summaryData)
      }
    } catch (error) {
      console.error("Error fetching summary data:", error)
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSummaryData()
  }, [fetchSummaryData])

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchSummaryData(false)
    }
  }, [refreshTrigger, fetchSummaryData])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-6 sm:h-8 w-24 bg-muted animate-pulse rounded mb-1" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const topCategory = data.topCategory ? getCategoryById(data.topCategory.category) : null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">${data.totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">All time expenses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">${data.monthlyExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Current month expenses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{data.transactionCount}</div>
          <p className="text-xs text-muted-foreground">Total transactions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold truncate">
            {topCategory ? `${topCategory.icon} ${topCategory.name}` : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.topCategory ? `$${data.topCategory.amount.toFixed(2)}` : "No data"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

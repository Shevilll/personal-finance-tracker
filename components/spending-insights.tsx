"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SpendingInsight {
  type: "success" | "warning" | "danger" | "info"
  title: string
  description: string
  icon: React.ReactNode
}

interface SpendingInsightsProps {
  refreshTrigger?: number
}

export function SpendingInsights({ refreshTrigger }: SpendingInsightsProps) {
  const [insights, setInsights] = useState<SpendingInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchInsights = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true)
      const response = await fetch("/api/budgets/insights", {
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        setInsights(data)
      }
    } catch (error) {
      console.error("Error fetching insights:", error)
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchInsights(false)
    }
  }, [refreshTrigger, fetchInsights])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Add more transactions and set budgets to get personalized insights!
          </p>
        </CardContent>
      </Card>
    )
  }

  const getVariant = (type: string) => {
    switch (type) {
      case "success":
        return "default"
      case "warning":
        return "secondary"
      case "danger":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="mt-0.5">{insight.icon}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge variant={getVariant(insight.type)} className="text-xs">
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

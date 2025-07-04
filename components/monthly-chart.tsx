"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyData {
  month: string;
  expenses: number;
}

interface MonthlyChartProps {
  refreshTrigger?: number;
}

export function MonthlyChart({ refreshTrigger }: MonthlyChartProps) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsInitialLoading(true);
      setError(null);
      const response = await fetch("/api/transactions/monthly", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch monthly data");
      }

      const monthlyData = await response.json();
      setData(monthlyData);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
      setError("Failed to load chart data");
    } finally {
      if (showLoading) setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthlyData();
  }, [fetchMonthlyData]);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchMonthlyData(false);
    }
  }, [refreshTrigger, fetchMonthlyData]);

  if (isInitialLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-sm">Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-destructive text-sm text-center">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm text-center">
          No expense data available
        </p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 80,
          }}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tickMargin={15}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
            tickFormatter={(value) => `$${value}`}
            width={70}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Expenses"]}
            labelStyle={{ color: "hsl(var(--foreground))", fontSize: "13px" }}
            contentStyle={{
              fontSize: "13px",
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar
            dataKey="expenses"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            stroke="hsl(var(--primary))"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

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
  Legend,
} from "recharts";
import { getCategoryById } from "@/lib/categories";

interface BudgetComparisonData {
  category: string;
  budgeted: number;
  actual: number;
}

interface BudgetVsActualChartProps {
  refreshTrigger?: number;
}

export function BudgetVsActualChart({
  refreshTrigger,
}: BudgetVsActualChartProps) {
  const [data, setData] = useState<BudgetComparisonData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparisonData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsInitialLoading(true);
      setError(null);
      const response = await fetch("/api/budgets/comparison", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch comparison data");
      }

      const comparisonData = await response.json();
      setData(comparisonData);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      setError("Failed to load comparison data");
    } finally {
      if (showLoading) setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComparisonData();
  }, [fetchComparisonData]);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchComparisonData(false);
    }
  }, [refreshTrigger, fetchComparisonData]);

  if (isInitialLoading) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="animate-pulse text-sm">Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <p className="text-destructive text-sm text-center">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm text-center">
          No budget comparison data available
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const category = getCategoryById(label);
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2 text-sm">
            {category.icon} {category.name}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Transform data to show category names with proper truncation
  const chartData = data.map((item) => {
    const category = getCategoryById(item.category);
    return {
      ...item,
      categoryName:
        category.name.length > 10
          ? category.name.substring(0, 8) + "..."
          : category.name,
      fullName: category.name,
    };
  });

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 60,
          }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="categoryName"
            tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
            angle={-45}
            textAnchor="end"
            height={120}
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
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              fontSize: "13px",
              paddingTop: "15px",
              color: "hsl(var(--foreground))",
            }}
            iconType="rect"
          />
          <Bar
            dataKey="budgeted"
            fill="hsl(var(--primary))"
            name="Budgeted"
            radius={[3, 3, 0, 0]}
            stroke="hsl(var(--primary))"
            strokeWidth={1}
          />
          <Bar
            dataKey="actual"
            fill="hsl(var(--destructive))"
            name="Actual"
            radius={[3, 3, 0, 0]}
            stroke="hsl(var(--destructive))"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

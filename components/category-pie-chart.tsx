"use client";

import { useEffect, useState, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getCategoryById } from "@/lib/categories";

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

interface CategoryPieChartProps {
  refreshTrigger?: number;
}

export function CategoryPieChart({ refreshTrigger }: CategoryPieChartProps) {
  const [data, setData] = useState<CategoryData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsInitialLoading(true);
      setError(null);
      const response = await fetch("/api/transactions/categories", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch category data");
      }

      const categoryData = await response.json();
      setData(categoryData);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setError("Failed to load category data");
    } finally {
      if (showLoading) setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchCategoryData(false);
    }
  }, [refreshTrigger, fetchCategoryData]);

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
          No category data available
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const category = getCategoryById(data.category);
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-1">
            {category.icon} {category.name}
          </p>
          <p className="text-sm text-muted-foreground">
            ${data.amount.toFixed(2)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4 px-2">
        {payload.slice(0, 6).map((entry: any, index: number) => {
          const category = getCategoryById(entry.payload.category);
          return (
            <div key={index} className="flex items-center gap-1 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="hidden sm:inline truncate max-w-[80px]">
                {category.icon} {category.name}
              </span>
              <span className="sm:hidden">{category.icon}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            outerRadius={80}
            dataKey="amount"
            label={({ percentage }) => `${percentage.toFixed(0)}%`}
            labelLine={false}
            stroke="hsl(var(--background))"
            strokeWidth={2}
          >
            {data.map((entry, index) => {
              const category = getCategoryById(entry.category);
              return <Cell key={`cell-${index}`} fill={category.color} />;
            })}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

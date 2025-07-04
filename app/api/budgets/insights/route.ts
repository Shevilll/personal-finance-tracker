import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { startOfMonth, endOfMonth, subMonths } from "date-fns"
import { getCategoryById } from "@/lib/categories"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

async function connectToDatabase() {
  try {
    await client.connect()
    return client.db("finance_tracker")
  } catch (error) {
    console.error("Database connection error:", error)
    throw new Error("Failed to connect to database")
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase()
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    const insights = []

    // Get budgets
    const budgets = await db.collection("budgets").find({}).toArray()

    if (budgets.length === 0) {
      return NextResponse.json([])
    }

    // Get current month spending
    const currentSpending = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            amount: { $lt: 0 },
            date: { $gte: monthStart, $lte: monthEnd },
          },
        },
        {
          $group: {
            _id: "$category",
            spent: { $sum: { $abs: "$amount" } },
          },
        },
      ])
      .toArray()

    // Get last month spending
    const lastMonthSpending = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            amount: { $lt: 0 },
            date: { $gte: lastMonthStart, $lte: lastMonthEnd },
          },
        },
        {
          $group: {
            _id: "$category",
            spent: { $sum: { $abs: "$amount" } },
          },
        },
      ])
      .toArray()

    const currentSpendingMap = new Map()
    currentSpending.forEach((item) => {
      currentSpendingMap.set(item._id, item.spent)
    })

    const lastMonthSpendingMap = new Map()
    lastMonthSpending.forEach((item) => {
      lastMonthSpendingMap.set(item._id, item.spent)
    })

    // Analyze each budget
    budgets.forEach((budget) => {
      const currentSpent = currentSpendingMap.get(budget.category) || 0
      const lastMonthSpent = lastMonthSpendingMap.get(budget.category) || 0
      const percentage = budget.amount > 0 ? (currentSpent / budget.amount) * 100 : 0
      const category = getCategoryById(budget.category)

      // Budget status insights
      if (percentage >= 100) {
        insights.push({
          type: "danger",
          title: `${category.name} Budget Exceeded`,
          description: `You've spent $${currentSpent.toFixed(2)} out of your $${budget.amount.toFixed(2)} budget (${percentage.toFixed(1)}%).`,
          icon: "⚠️",
        })
      } else if (percentage >= 80) {
        insights.push({
          type: "warning",
          title: `${category.name} Budget Alert`,
          description: `You're at ${percentage.toFixed(1)}% of your budget with $${(budget.amount - currentSpent).toFixed(2)} remaining.`,
          icon: "🔔",
        })
      } else if (percentage <= 50 && currentSpent > 0) {
        insights.push({
          type: "success",
          title: `${category.name} On Track`,
          description: `Great job! You're only at ${percentage.toFixed(1)}% of your budget.`,
          icon: "✅",
        })
      }

      // Month-over-month comparison
      if (lastMonthSpent > 0) {
        const change = ((currentSpent - lastMonthSpent) / lastMonthSpent) * 100
        if (Math.abs(change) > 20) {
          const direction = change > 0 ? "increased" : "decreased"
          const emoji = change > 0 ? "📈" : "📉"
          insights.push({
            type: change > 0 ? "info" : "success",
            title: `${category.name} Spending ${direction}`,
            description: `Your ${category.name.toLowerCase()} spending has ${direction} by ${Math.abs(change).toFixed(1)}% compared to last month.`,
            icon: emoji,
          })
        }
      }
    })

    // Overall insights
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
    const totalSpent = Array.from(currentSpendingMap.values()).reduce((sum: number, spent: number) => sum + spent, 0)
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

    if (overallPercentage < 70) {
      insights.push({
        type: "success",
        title: "Excellent Budget Management",
        description: `You've used only ${overallPercentage.toFixed(1)}% of your total monthly budget. Keep it up!`,
        icon: "🎯",
      })
    }

    // Limit to top 5 insights
    return NextResponse.json(insights.slice(0, 5))
  } catch (error) {
    console.error("Error generating insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}

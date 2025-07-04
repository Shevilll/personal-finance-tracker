import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { startOfMonth, endOfMonth } from "date-fns"

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

    // Get budgets
    const budgets = await db.collection("budgets").find({}).toArray()

    if (budgets.length === 0) {
      return NextResponse.json([])
    }

    // Get current month spending by category
    const spendingData = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            amount: { $lt: 0 }, // Only expenses
            date: {
              $gte: monthStart,
              $lte: monthEnd,
            },
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

    // Create spending map
    const spendingMap = new Map()
    spendingData.forEach((item) => {
      spendingMap.set(item._id, item.spent)
    })

    // Calculate progress for each budget
    const budgetProgress = budgets.map((budget) => {
      const spent = spendingMap.get(budget.category) || 0
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

      let status = "under"
      if (percentage >= 100) {
        status = "over"
      } else if (percentage >= 80) {
        status = "near"
      }

      return {
        category: budget.category,
        budgeted: budget.amount,
        spent,
        percentage,
        status,
      }
    })

    return NextResponse.json(budgetProgress)
  } catch (error) {
    console.error("Error fetching budget progress:", error)
    return NextResponse.json({ error: "Failed to fetch budget progress" }, { status: 500 })
  }
}

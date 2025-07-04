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

    // Get total expenses
    const totalExpensesResult = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            amount: { $lt: 0 }, // Only expenses
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $abs: "$amount" } },
          },
        },
      ])
      .toArray()

    // Get monthly expenses
    const monthlyExpensesResult = await db
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
            _id: null,
            total: { $sum: { $abs: "$amount" } },
          },
        },
      ])
      .toArray()

    // Get transaction count
    const transactionCount = await db.collection("transactions").countDocuments({
      amount: { $lt: 0 }, // Only expenses
    })

    // Get top category
    const topCategoryResult = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            amount: { $lt: 0 }, // Only expenses
          },
        },
        {
          $group: {
            _id: "$category",
            amount: { $sum: { $abs: "$amount" } },
          },
        },
        {
          $sort: { amount: -1 },
        },
        {
          $limit: 1,
        },
      ])
      .toArray()

    const summaryData = {
      totalExpenses: totalExpensesResult.length > 0 ? totalExpensesResult[0].total : 0,
      monthlyExpenses: monthlyExpensesResult.length > 0 ? monthlyExpensesResult[0].total : 0,
      transactionCount,
      topCategory:
        topCategoryResult.length > 0
          ? {
              category: topCategoryResult[0]._id,
              amount: topCategoryResult[0].amount,
            }
          : null,
    }

    return NextResponse.json(summaryData)
  } catch (error) {
    console.error("Error fetching summary data:", error)
    return NextResponse.json({ error: "Failed to fetch summary data" }, { status: 500 })
  }
}

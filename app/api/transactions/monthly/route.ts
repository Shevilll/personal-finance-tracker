import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"

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

    // Get data for the last 6 months
    const monthlyData = []

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)

      const result = await db
        .collection("transactions")
        .aggregate([
          {
            $match: {
              date: {
                $gte: monthStart,
                $lte: monthEnd,
              },
              amount: { $lt: 0 }, // Only expenses (negative amounts)
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

      monthlyData.push({
        month: format(date, "MMM yyyy"),
        expenses: result.length > 0 ? result[0].total : 0,
      })
    }

    return NextResponse.json(monthlyData)
  } catch (error) {
    console.error("Error fetching monthly data:", error)
    return NextResponse.json({ error: "Failed to fetch monthly data" }, { status: 500 })
  }
}

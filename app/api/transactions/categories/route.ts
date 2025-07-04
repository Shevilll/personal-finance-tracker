import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

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

    const categoryData = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            amount: { $lt: 0 }, // Only expenses (negative amounts)
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
      ])
      .toArray()

    // Calculate total for percentages
    const total = categoryData.reduce((sum, item) => sum + item.amount, 0)

    // Format data for pie chart
    const formattedData = categoryData.map((item) => ({
      category: item._id,
      amount: item.amount,
      percentage: total > 0 ? (item.amount / total) * 100 : 0,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching category data:", error)
    return NextResponse.json({ error: "Failed to fetch category data" }, { status: 500 })
  }
}

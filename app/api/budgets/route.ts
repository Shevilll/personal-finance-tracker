import { type NextRequest, NextResponse } from "next/server"
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
    const budgets = await db.collection("budgets").find({}).toArray()

    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { budgets } = body

    if (!budgets || !Array.isArray(budgets)) {
      return NextResponse.json({ error: "Invalid budgets data" }, { status: 400 })
    }

    const db = await connectToDatabase()

    // Clear existing budgets and insert new ones
    await db.collection("budgets").deleteMany({})

    if (budgets.length > 0) {
      const budgetDocuments = budgets.map((budget) => ({
        category: budget.category,
        amount: Number(budget.amount),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      await db.collection("budgets").insertMany(budgetDocuments)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving budgets:", error)
    return NextResponse.json({ error: "Failed to save budgets" }, { status: 500 })
  }
}

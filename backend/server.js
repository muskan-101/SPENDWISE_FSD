const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors())
// Increase JSON payload limit to accept base64 image strings successfully
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.get("/", (req, res) => {
  res.send("Backend running")
})

mongoose.connect("mongodb://127.0.0.1:27017/spendwise")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

const Expense = require("./models/Expense")

// ==========================================
// CREATE: Add Expense
// ==========================================
app.post("/api/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body)
    await expense.save()
    res.status(201).json({ message: "Expense Added", expense })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ==========================================
// READ: Get Expenses with advanced MongoDB filter operators
// Commands demoed: $regex, $options, $in, $gte, $lte, .sort()
// ==========================================
app.get("/api/expenses", async (req, res) => {
  try {
    const { search, category, startDate, endDate, sort } = req.query
    
    // Build query object
    let query = {}

    // Search by text using regex operator
    if (search) {
      query.$or = [
        { event: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ]
    }

    // Filter by Category using exact match
    if (category && category !== "All") {
      query.category = category
    }

    // Date range using $gte / $lte
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = startDate
      if (endDate) query.date.$lte = endDate
    }

    // Handle Sorting dynamically
    let sortObj = { date: -1 } // newest default
    if (sort === "oldest") sortObj = { date: 1 }
    else if (sort === "highest") sortObj = { amount: -1 }
    else if (sort === "lowest") sortObj = { amount: 1 }

    const data = await Expense.find(query).sort(sortObj)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ==========================================
// AGGREGATION: Get statistics using Pipeline
// Commands demoed: $match, $group, $sum, $max, $avg, $sort, $project
// ==========================================
app.get("/api/expenses/stats", async (req, res) => {
  try {
    const { search, category, startDate, endDate } = req.query
    
    // Aggregation Match step (same logic as basic find)
    let matchQuery = {}
    if (search) {
      matchQuery.$or = [
        { event: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ]
    }
    if (category && category !== "All") matchQuery.category = category
    if (startDate || endDate) {
      matchQuery.date = {}
      if (startDate) matchQuery.date.$gte = startDate
      if (endDate) matchQuery.date.$lte = endDate
    }

    // 1. Overall Stats
    const overallStats = await Expense.aggregate([
      { $match: matchQuery },
      { 
        $group: {
          _id: null,
          totalSpending: { $sum: "$amount" },
          highestExpense: { $max: "$amount" },
          averageExpense: { $avg: "$amount" },
          transactions: { $sum: 1 }
        }
      }
    ])

    // 2. Category Breakdown
    const categoryBreakdown = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $ifNull: ["$category", "Uncategorized"] },
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { totalAmount: -1 } },
      {
        $project: {
          name: "$_id",
          amount: "$totalAmount",
          _id: 0
        }
      }
    ])

    res.json({
      overall: overallStats.length > 0 ? overallStats[0] : { totalSpending: 0, highestExpense: 0, transactions: 0 },
      breakdown: categoryBreakdown
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ==========================================
// DELETE: Delete an expense by ID
// Commands demoed: findByIdAndDelete
// ==========================================
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id)
    res.json({ message: "Expense deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ==========================================
// UPDATE: Example for future extensions
// Commands demoed: findByIdAndUpdate, $set
// ==========================================
app.put("/api/expenses/:id/status", async (req, res) => {
  try {
    const { status } = req.body
    const updated = await Expense.findByIdAndUpdate(
      req.params.id, 
      { $set: { status: status } }, 
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})

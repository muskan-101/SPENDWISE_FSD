const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
  event: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "pending" },
  submittedBy: { type: String, default: "Unknown User" }, // who submitted it
  billFile: { type: String, required: true }
}, { timestamps: true })

// Add indexing for faster query performance on DBMS project showcase
expenseSchema.index({ category: 1 })
expenseSchema.index({ date: -1 })
expenseSchema.index({ event: "text" })

module.exports = mongoose.model("Expense", expenseSchema)
import "./ExpenseForm.css"
import { useState } from "react"

function ExpenseForm({ onFormSubmit = () => {} }) {
  const [eventName, setEventName] = useState("")
  const [category, setCategory] = useState("")
  const [otherCategory, setOtherCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [billFile, setBillFile] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBillFile(reader.result) // Saves as base64 string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const finalCategory = category === "others" ? otherCategory : category
    if (!eventName || !finalCategory || !amount || !date) {
      alert("Please fill all required basic fields")
      return
    }

    if (!billFile) {
      alert("A bill MUST be uploaded to process the expense!")
      return
    }

    const payload = {
      event: eventName,
      category: finalCategory,
      amount: Number(amount),
      date: date,
      description: description, // Explicitly pass the description to the schema
      status: "pending", // default
      billFile: billFile
    }

    try {
      const res = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Increasing typical body limits on fetch by default handles these but express might complain if it's too big! Keep bill images small.
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert("Expense Added Successfully!")
        // reset form
        setEventName("")
        setCategory("")
        setOtherCategory("")
        setAmount("")
        setDate("")
        setDescription("")
        setBillFile(null)
        onFormSubmit() // call parent logic if necessary
      } else {
        const errData = await res.json()
        alert("Failed to add expense: " + (errData.error || "Unknown Error"))
      }
    } catch (err) {
      console.error(err)
      alert("Error connecting to server")
    }
  }

  return (
    <div className="formContainer">
      <h2>Submit Expense Report</h2>

      <form className="expenseForm" onSubmit={handleSubmit}>

        <label>Event Name *</label>
        <input 
          type="text" 
          placeholder="Enter event name"
          value={eventName}
          onChange={e => setEventName(e.target.value)}
        />

        <label>Category *</label>
        <select 
          value={category} 
          onChange={(e)=>setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Print">Print</option>
          <option value="Decoration">Decoration</option>
          <option value="Prizes">Prizes</option>
          <option value="Travel">Travel</option>
          <option value="others">Others</option>
        </select>

        {category === "others" && (
          <>
            <label>Specify Category *</label>
            <input 
              type="text" 
              placeholder="Enter category"
              value={otherCategory}
              onChange={e => setOtherCategory(e.target.value)}
            />
          </>
        )}

        <label>Amount (₹) *</label>
        <input 
          type="number" 
          placeholder="Enter amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <label>Date of Expense *</label>
        <input 
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <label>Description / Justification</label>
        <textarea 
          placeholder="Explain the expense"
          value={description}
          onChange={e => setDescription(e.target.value)}
        ></textarea>

        <label>Upload Bill * (Image or PDF)</label>
        <input 
          type="file" 
          accept="image/*,application/pdf"
          onChange={handleFileChange} 
        />

        <button type="submit">Submit Expense</button>
      </form>
    </div>
  )
}

export default ExpenseForm
import "./ExpenseForm.css"
import { useState } from "react"

function ExpenseForm(){
const [category,setCategory] = useState("")

  return(

    <div className="formContainer">

      <h2>Submit Expense Report</h2>

      <form className="expenseForm">

        {/* Event Name */}

        <label>Event Name</label>
        <input type="text" placeholder="Enter event name"/>


        {/* Category Dropdown */}

        <label>Category</label>
        <select 
        value={category} 
        onChange={(e)=>setCategory(e.target.value)}
        >

          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="print">Print</option>
          <option value="decoration">Decoration</option>
          <option value="prizes">Prizes</option>
          <option value="travel">Travel</option>
          <option value="others">Others</option>

        </select>


        {/* If category = others */}

        {category==="others" && (

          <>
            <label>Specify Category</label>
            <input type="text" placeholder="Enter category"/>
          </>

        )}


        {/* Amount */}

        <label>Amount (₹)</label>
        <input type="number" placeholder="Enter amount"/>


        {/* Date */}

        <label>Date of Expense</label>
        <input type="date"/>


        {/* Description */}

        <label>Description / Justification</label>
        <textarea placeholder="Explain the expense"></textarea>


        {/* Upload Bill */}

        <label>Upload Bill</label>
        <input type="file"/>


        {/* Submit Button */}

        <button type="submit">Submit Expense</button>

      </form>

    </div>

  )
}

export default ExpenseForm
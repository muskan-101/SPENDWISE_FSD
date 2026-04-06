import { useEffect, useState } from "react"
import "./SummaryCards.css"

function SummaryCards(){
  const [stats, setStats] = useState({
    transactions: 0,
    approved: 0,
    pending: 0
  })

  useEffect(() => {
    // Fetch all raw data from MongoDB to calculate accurate status counts
    fetch("http://localhost:5000/api/expenses")
      .then(res => res.json())
      .then(data => {
        const total = data.length
        const pendingCount = data.filter(e => (e.status || "").toLowerCase() === "pending").length
        const approvedCount = data.filter(e => (e.status || "").toLowerCase() === "approved" || (e.status || "").toLowerCase() === "completed").length
        
        setStats({
          transactions: total,
          approved: approvedCount,
          pending: pendingCount
        })
      })
      .catch(err => console.error("Error fetching summary:", err))
  }, [])

  return(

    <div className="summaryContainer">

      <div className="message">
        Ready to manage your expenses?
      </div>

      <div className="card">
        <h3>Total Expenses Submitted</h3>
        <p>{stats.transactions}</p>
      </div>

      <div className="card">
        <h3>Approved Expenses</h3>
        <p>{stats.approved}</p>
      </div>

      <div className="card">
        <h3>Pending Approval</h3>
        <p>{stats.pending}</p>
      </div>

      <div className="card">
        <h3>Download Records</h3>
        <button>Download</button>
      </div>

    </div>

  )
}

export default SummaryCards
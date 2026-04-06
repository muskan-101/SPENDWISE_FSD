import { useEffect, useState } from "react"
import "./ExpenseList.css"

function ExpenseList() {
  const [recentExpenses, setRecentExpenses] = useState([])

  useEffect(() => {
    // Fetch latest overall expenses from MongoDB
    fetch("http://localhost:5000/api/expenses?sort=newest")
      .then(res => res.json())
      .then(data => {
        setRecentExpenses(data.slice(0, 5)) // Get latest 5
      })
      .catch(err => console.error("Error fetching recent expenses:", err))
  }, [])

  return (

    <div className="expenseSection">

      <h2>Recent Expenses (Live from MongoDB)</h2>

      <table>

        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Category</th>
          </tr>
        </thead>

        <tbody>

          {recentExpenses.length > 0 ? (
            recentExpenses.map((exp, i) => (
              <tr key={i}>
                <td>{exp.event}</td>
                <td>₹{Number(exp.amount).toLocaleString()}</td>
                <td className={`status-${exp.status?.toLowerCase() || 'completed'}`}>
                  {exp.status || "Completed"}
                </td>
                <td>{exp.category}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{textAlign: "center"}}>No recent expenses found</td>
            </tr>
          )}

        </tbody>

      </table>

    </div>

  )
}

export default ExpenseList
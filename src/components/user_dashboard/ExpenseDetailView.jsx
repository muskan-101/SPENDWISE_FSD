import { useEffect, useState } from "react"
import "./ExpenseDetailView.css"

function ExpenseDetailView({ onBack }) {
  const [expenses, setExpenses] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [sortOrder, setSortOrder] = useState("newest") // newest, oldest, highest, lowest
  
  const [stats, setStats] = useState({
    totalAmount: 0,
    highestExpense: 0,
    numTransactions: 0
  })

  // To populate category dropdown
  const [allCategories, setAllCategories] = useState([])

  const fetchDetailData = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (searchQuery) queryParams.append("search", searchQuery)
      if (categoryFilter !== "All") queryParams.append("category", categoryFilter)
      if (dateFilter) queryParams.append("startDate", dateFilter) // Or exact date? using startDate for general
      if (sortOrder) queryParams.append("sort", sortOrder)

      const queryStr = queryParams.toString()

      // Fetch list with sorting
      const listRes = await fetch(`http://localhost:5000/api/expenses?${queryStr}`)
      const listData = await listRes.json()
      setExpenses(listData)

      // Get unique categories for dropdown
      if (allCategories.length === 0) {
        const allRes = await fetch(`http://localhost:5000/api/expenses`)
        const allData = await allRes.json()
        const cats = [...new Set(allData.map(e => e.category || "Uncategorized"))]
        setAllCategories(["All", ...cats])
      }

      // Fetch Stats
      const statsRes = await fetch(`http://localhost:5000/api/expenses/stats?${queryStr}`)
      const statsData = await statsRes.json()
      
      setStats({
        totalAmount: statsData.overall.totalSpending || 0,
        highestExpense: statsData.overall.highestExpense || 0,
        numTransactions: statsData.overall.transactions || 0
      })
    } catch (error) {
      console.error("Error fetching detail data:", error)
    }
  }

  useEffect(() => {
    fetchDetailData()
  }, [searchQuery, dateFilter, categoryFilter, sortOrder])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await fetch(`http://localhost:5000/api/expenses/${id}`, { method: 'DELETE' })
        fetchDetailData()
      } catch (err) {
        console.error("Error deleting expense:", err)
      }
    }
  }

  return (
    <div className="expenseDetailView">
      <div className="edv-header">
        <button className="edv-backBtn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h2 className="edv-title">Detailed Expense Report (DBMS Connected)</h2>
      </div>

      <div className="edv-statsContainer">
        <div className="edv-statCard edv-primaryStat">
          <p className="edv-statLabel">Total Filtered Spending</p>
          <h3 className="edv-statValue">₹{stats.totalAmount.toLocaleString()}</h3>
        </div>
        <div className="edv-statCard">
          <p className="edv-statLabel">Highest Filtered Expense</p>
          <h3 className="edv-statValue">₹{stats.highestExpense.toLocaleString()}</h3>
        </div>
        <div className="edv-statCard">
          <p className="edv-statLabel">Filtered Transactions</p>
          <h3 className="edv-statValue">{stats.numTransactions}</h3>
        </div>
      </div>

      <div className="edv-controlsSection">
        <input 
          type="text" 
          placeholder="Search by title or category..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="edv-input edv-search"
        />
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="edv-input"
        >
          {allCategories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
        <input 
          type="date" 
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="edv-input"
        />
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="edv-input"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
        
        { (searchQuery || dateFilter || categoryFilter !== "All" || sortOrder !== "newest") && (
          <button 
            className="edv-clearBtn" 
            onClick={() => {
              setSearchQuery("")
              setDateFilter("")
              setCategoryFilter("All")
              setSortOrder("newest")
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="edv-tableContainer">
        {expenses.length === 0 ? (
          <div className="edv-emptyState">No expenses found matching the criteria.</div>
        ) : (
          <table className="edv-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td className="edv-tdTitle">{exp.event}</td>
                  <td>{exp.category}</td>
                  <td>{exp.description || "-"}</td>
                  <td>{exp.date}</td>
                  <td className="edv-tdAmount">₹{Number(exp.amount).toLocaleString()}</td>
                  <td>
                    <span className={`edv-status ${exp.status?.toLowerCase() || ''}`}>
                      {exp.status || "Completed"}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => {
                        if (!exp.billFile) return alert("No bill attached.")
                        // Create a temporary link element to trigger cross-browser secure file download / view
                        const link = document.createElement("a")
                        link.href = exp.billFile
                        link.download = `Bill_${exp.event.replace(/\s+/g,'_')}` // Forces downloading it safely without browser blocking
                        link.click()
                      }}
                      style={{background: 'var(--primary-color)', marginRight: '8px', border:'none', color:'black', cursor:'pointer', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold'}}
                    >
                      View Bill
                    </button>
                    <button 
                      onClick={() => handleDelete(exp._id)}
                      style={{background: 'transparent', border:'none', color:'red', cursor:'pointer'}}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}

export default ExpenseDetailView

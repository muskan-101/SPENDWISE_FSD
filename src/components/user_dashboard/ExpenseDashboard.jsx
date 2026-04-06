import { useEffect, useState } from "react"
import "./ExpenseDashboard.css"

function ExpenseDashboard({ onViewDetails }) {
  const [expenses, setExpenses] = useState([])
  const [stats, setStats] = useState({
    totalThisMonth: 0,
    highestExpense: 0,
    numTransactions: 0,
    categoryBreakdown: []
  })

  // Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  
  // To populate category dropdown
  const [allCategories, setAllCategories] = useState([])

  const fetchDashboardData = async () => {
    try {
      // Build query string
      const queryParams = new URLSearchParams()
      if (searchQuery) queryParams.append("search", searchQuery)
      if (categoryFilter !== "All") queryParams.append("category", categoryFilter)
      if (dateFilter) queryParams.append("startDate", dateFilter)
      
      const queryStr = queryParams.toString()

      // 1. Fetch filtered expense list
      const listRes = await fetch(`http://localhost:5000/api/expenses?${queryStr}`)
      const listData = await listRes.json()
      setExpenses(listData)

      // Get unique categories for dropdown (just grabbing from the current DB snapshot)
      if (allCategories.length === 0) {
        // Just for initial dropdown population
        const allRes = await fetch(`http://localhost:5000/api/expenses`)
        const allData = await allRes.json()
        const cats = [...new Set(allData.map(e => e.category || "Uncategorized"))]
        setAllCategories(["All", ...cats])
      }

      // 2. Fetch Aggregated Statistics
      const statsRes = await fetch(`http://localhost:5000/api/expenses/stats?${queryStr}`)
      const statsData = await statsRes.json()
      
      setStats({
        totalThisMonth: statsData.overall.totalSpending || 0,
        highestExpense: statsData.overall.highestExpense || 0,
        numTransactions: statsData.overall.transactions || 0,
        categoryBreakdown: statsData.breakdown || []
      })

    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  // Refetch data from MongoDB whenever a filter changes
  useEffect(() => {
    fetchDashboardData()
  }, [searchQuery, dateFilter, categoryFilter])


  return (
    <div className="expenseDashboard">
      <div className="ed-headerRow">
        <h2 className="ed-title">Expense Dashboard</h2>
        <button className="ed-viewDetailsBtn" onClick={onViewDetails}>
          View Detailed Report
        </button>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="ed-statsContainer">
        <div className="ed-statCard ed-primaryStat">
          <p className="ed-statLabel">Total Spending</p>
          <h3 className="ed-statValue">₹{stats.totalThisMonth.toLocaleString()}</h3>
        </div>
        <div className="ed-statCard">
          <p className="ed-statLabel">Highest Expense</p>
          <h3 className="ed-statValue">₹{stats.highestExpense.toLocaleString()}</h3>
        </div>
        <div className="ed-statCard">
          <p className="ed-statLabel">Transactions</p>
          <h3 className="ed-statValue">{stats.numTransactions}</h3>
        </div>
      </div>

      <div className="ed-mainContentRow">
        {/* LEFT COLUMN: FILTERS & RECENT LIST */}
        <div className="ed-leftColumn">
          
          <div className="ed-filtersBox">
            <h4 className="ed-sectionTitle">Filter & Search</h4>
            <div className="ed-filterControls">
              <input 
                type="text" 
                placeholder="Search expenses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ed-filterInput ed-searchBar"
              />
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="ed-filterInput"
              >
                {allCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="ed-filterInput"
              />
              { (searchQuery || dateFilter || categoryFilter !== "All") && (
                <button 
                  className="ed-clearBtn" 
                  onClick={() => {
                    setSearchQuery("")
                    setDateFilter("")
                    setCategoryFilter("All")
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="ed-recentSection">
            <h4 className="ed-sectionTitle">Recent Expenses</h4>
            {expenses.length === 0 ? (
              <div className="ed-emptyState">No expenses found matching filters.</div>
            ) : (
              <div className="ed-expenseList">
                {expenses.slice(0, 10).map((exp, index) => (
                  <div className="ed-expenseItem" key={index}>
                    <div className="ed-expenseItemLeft">
                      <div className="ed-expenseIcon">
                        {exp.category?.charAt(0).toUpperCase() || "E"}
                      </div>
                      <div className="ed-expenseDetails">
                        <p className="ed-expenseName">{exp.event}</p>
                        <p className="ed-expenseMeta">{exp.category} • {exp.date}</p>
                      </div>
                    </div>
                    <div className="ed-expenseItemRight">
                      <p className="ed-expenseAmount">₹{Number(exp.amount).toLocaleString()}</p>
                      <span className={`ed-statusBadge ${exp.status?.toLowerCase() || ''}`}>
                        {exp.status || "Completed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CHART / BREAKDOWN */}
        <div className="ed-rightColumn">
          <div className="ed-breakdownBox">
            <h4 className="ed-sectionTitle">Category Aggregation Chart</h4>
            {stats.categoryBreakdown.length === 0 ? (
              <div className="ed-emptyState">No data</div>
            ) : (
              <div className="ed-chartWrapper">
                {stats.categoryBreakdown.map((cat, idx) => {
                  const percentage = stats.totalThisMonth === 0 ? 0 : Math.round((cat.amount / stats.totalThisMonth) * 100)
                   return (
                    <div className="ed-barRow" key={idx}>
                      <div className="ed-barInfo">
                        <span className="ed-barName">{cat.name}</span>
                        <span className="ed-barAmount">₹{cat.amount.toLocaleString()} ({percentage}%)</span>
                      </div>
                      <div className="ed-barTrack">
                        <div 
                          className="ed-barFill" 
                          style={{ width: `${percentage}%`, animationDelay: `${idx * 0.1}s` }}
                        ></div>
                      </div>
                    </div>
                   )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default ExpenseDashboard
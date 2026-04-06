import "./Sidebar.css"

function Sidebar({ isOpen, closeSidebar, openDashboard, openForm, openExpenses, onNavigate }) {
  const handleSummaryClick = () => {
    // 1. Ensure we are on the main user dashboard where the summary actually exists
    if (openDashboard) openDashboard()
    
    // 2. Wait a tiny bit for React to render the main dashboard components safely
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      })
    }, 100)

    closeSidebar()
  }

  const handleDashboardClick = () => {
    if (openDashboard) openDashboard()
    closeSidebar()
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>

      <div className="sidebar-header">
        <h2>Menu</h2>
        <button className="closeBtn" onClick={closeSidebar}>✕</button>
      </div>

      <ul>
        <li className="active" onClick={handleDashboardClick}><span>📊</span> Dashboard</li>
        <li onClick={() => { openForm(); closeSidebar(); }}><span>📝</span> Submit Expense</li>
        <li onClick={() => { openExpenses(); closeSidebar(); }}><span>📋</span> My Expenses</li>
        <li onClick={handleSummaryClick}><span>📈</span> Summary</li>
        <li><span>⚙️</span> Settings</li>
        <li className="logout-item" onClick={() => onNavigate('home')}><span>🚪</span> Logout</li>
      </ul>

    </div>
  )
}

export default Sidebar
import "./Sidebar.css"

function Sidebar({ isOpen, closeSidebar, onNavigate }) {

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>

      <div className="sidebar-header">
        <h2>Menu</h2>
        <button className="closeBtn" onClick={closeSidebar}>✕</button>
      </div>

      <ul>
        <li className="active"><span>📊</span> Dashboard</li>
        <li><span>📝</span> Submit Expense</li>
        <li><span>📋</span> My Expenses</li>
        <li><span>📈</span> Summary</li>
        <li><span>⚙️</span> Settings</li>
        <li className="logout-item" onClick={() => onNavigate('home')}><span>🚪</span> Logout</li>
      </ul>

    </div>
  )
}

export default Sidebar
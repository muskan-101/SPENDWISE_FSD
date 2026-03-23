import "./DashboardNavbar.css"

function DashboardNavbar({name, openSidebar, openForm}){

  return(
    <nav className="dashboardNavbar">

      <button className="menuBtn" onClick={openSidebar}>☰</button>

      <div className="logo">
        SPENDWISE
      </div>

      <div className="welcome">
        Welcome back, {name} !
      </div>

      <div className="navLinks">
        <button onClick={openForm}>Submit Expense</button>
        <button>My Expenses</button>
        <button>Summary</button>
      </div>

    </nav>
  )
}

export default DashboardNavbar
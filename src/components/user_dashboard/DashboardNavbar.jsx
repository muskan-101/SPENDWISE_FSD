import "./DashboardNavbar.css"

function DashboardNavbar({name, openSidebar}){

  return(
    <nav className="dashboardNavbar">

      <button className="menuBtn" onClick={openSidebar}>☰</button>

      <div className="logo">
        SPENDWISE
      </div>

      <div className="welcome">
        Welcome back, {name} !
      </div>

    </nav>
  )
}

export default DashboardNavbar
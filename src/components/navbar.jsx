import "./Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo-section">
        <div className="logo-box"></div>
        <h2>SpendWise</h2>
      </div>

      <div className="nav-links">
        <a href="#">Features</a>
        <a href="#">Login</a>
      </div>

    </nav>
  )
}

export default Navbar
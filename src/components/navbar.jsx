import "./Navbar.css"

function Navbar({ onNavigate, activePage }) {
  return (
    <nav className="navbar">

      <div className="logo-section" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
        <div className="logo-box"></div>
        <h2>SpendWise</h2>
      </div>

      <div className="nav-links">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className={activePage === 'home' ? 'active' : ''}>Home</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className={activePage === 'login' ? 'active' : ''}>Login</a>
      </div>

    </nav>
  )
}

export default Navbar
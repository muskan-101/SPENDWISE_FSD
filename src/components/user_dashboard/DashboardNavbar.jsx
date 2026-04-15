import Logo from '../../assets/Aimsa.png';
import "./DashboardNavbar.css"

function DashboardNavbar({ name, openSidebar, darkMode, toggleTheme }) {

  return (
    <nav className="dashboardNavbar">

      <button className="menuBtn" onClick={openSidebar}>☰</button>

      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={Logo} alt="SpendWise Logo" style={{ height: '36px', width: 'auto' }} />
        <span className="brand-text-light" style={{ fontSize: '20px', textTransform: 'uppercase' }}>SPENDWISE</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div className="welcome">
          Welcome back, {name} !
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.3)',
            borderRadius: '30px',
            padding: '6px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            color: 'white',
            fontSize: '13px',
            fontWeight: 700,
            backdropFilter: 'blur(6px)',
            transition: 'all 0.25s ease',
            whiteSpace: 'nowrap'
          }}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

    </nav>
  )
}

export default DashboardNavbar
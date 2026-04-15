import Logo from '../assets/Aimsa.png';
import "./Navbar.css"

function Navbar({ onNavigate, activePage }) {
  return (
    <nav className="navbar">

      <div className="logo-section" onClick={() => onNavigate('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={Logo} alt="SpendWise Logo" style={{ height: '40px', width: 'auto' }} />
        <h2 className="brand-text-light" style={{ margin: 0, fontSize: '24px' }}>SpendWise</h2>
      </div>

      <div className="nav-links">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className={activePage === 'home' ? 'active' : ''}>Home</a>
        <a href="#" onClick={(e) => {
          e.preventDefault();
          if (activePage !== 'home') { onNavigate('home'); setTimeout(() => document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' }), 300); }
          else document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
        }} className={activePage === 'about' ? 'active' : ''}>About Us</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className={activePage === 'login' ? 'active' : ''}>Login</a>
      </div>

    </nav>
  )
}

export default Navbar
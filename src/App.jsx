import { useState } from "react"
import "./App.css"
import Navbar from "./components/navbar"
import Hero from "./components/hero"
import Features from "./components/features"
import Footer from "./components/footer"
import Login from "./login/Login"
import Signup from "./login/signup"
import AdminDashboard from "./dashboard/AdminDashboard"

function App() {
  const [activePage, setActivePage] = useState('home');
  const [role, setRole] = useState(null);

  const navigate = (page, selectedRole = null) => {
    setActivePage(page);
    if (selectedRole) {
      setRole(selectedRole);
    }
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar onNavigate={navigate} activePage={activePage} />
      {activePage === 'home' && (
        <>
          <Hero onNavigate={navigate} />
          <Features />
        </>
      )}
      {activePage === 'login' && <Login onNavigate={navigate} role={role} />}
      {activePage === 'signup' && <Signup onNavigate={navigate} />}
      {activePage === 'dashboard' && <AdminDashboard onNavigate={navigate} />}
      <Footer />
    </>
  )
}

export default App
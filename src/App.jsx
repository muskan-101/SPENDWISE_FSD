import { useState } from "react"
import "./App.css"

import Navbar from "./components/navbar"
import Hero from "./components/hero"
import Features from "./components/features"
import Footer from "./components/footer"
import Login from "./login/Login"
import Signup from "./login/signup"
import UserDashboard from "./components/user_dashboard/UserDashboard"

function App() {
  const [activePage, setActivePage] = useState('home');
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // NEW

  const navigate = (page, selectedRole = null) => {
    setActivePage(page);
    if (selectedRole) {
      setRole(selectedRole);
    }
    window.scrollTo(0, 0);
  };

  return (
    <>
      {isLoggedIn ? (
        <UserDashboard />
      ) : (
        <>
          <Navbar onNavigate={navigate} activePage={activePage} />

          {activePage === 'home' && (
            <>
              <Hero onNavigate={navigate} />
              <Features />
            </>
          )}

          {activePage === 'login' && (
            <Login 
              onNavigate={navigate} 
              role={role} 
              setIsLoggedIn={setIsLoggedIn} // optional for future
            />
          )}

          {activePage === 'signup' && (
            <Signup onNavigate={navigate} />
          )}

          <Footer />
        </>
      )}
    </>
  )
}

export default App
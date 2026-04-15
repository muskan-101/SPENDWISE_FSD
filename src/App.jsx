import { useState } from "react"
import "./App.css"

import Navbar from "./components/navbar"
import Hero from "./components/hero"
import Features from "./components/features"
import Footer from "./components/footer"
import Story from "./components/Story"
import Login from "./login/Login"
import Signup from "./login/signup"
import UserDashboard from "./components/user_dashboard/UserDashboard"
import AdminDashboard from "./dashboard/AdminDashboard"

function App() {
  const [activePage, setActivePage] = useState('home');
  const [role, setRole] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState('Guest');

  const navigate = (page, selectedRole = null, username = null) => {
    setActivePage(page);
    if (selectedRole !== null) setRole(selectedRole); // only update if explicitly provided
    if (username) setLoggedInUser(username);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {activePage === 'home' && (
        <>
          <Navbar onNavigate={navigate} activePage={activePage} />
          <Hero onNavigate={navigate} />
          <Features />
          <Story />
          <Footer />
        </>
      )}

      {activePage === 'login' && (
        <>
          <Navbar onNavigate={navigate} activePage={activePage} />
          <Login onNavigate={navigate} role={role} />
          <Footer />
        </>
      )}

      {activePage === 'signup' && (
        <>
          <Navbar onNavigate={navigate} activePage={activePage} />
          <Signup onNavigate={navigate} />
          <Footer />
        </>
      )}

      {activePage === 'dashboard' && (
        role === 'admin' ? (
          <AdminDashboard onNavigate={navigate} />
        ) : (
          <UserDashboard onNavigate={navigate} user={{ name: loggedInUser }} />
        )
      )}
    </>
  )
}

export default App
import "./UserDashboard.css"
import { useState } from "react"

import DashboardNavbar from "./DashboardNavbar"
import SummaryCards from "./SummaryCards"
import FeatureButtons from "./FeatureButtons"
import ExpenseList from "./ExpenseList"
import ExpenseForm from "./ExpenseForm"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import ExpenseDashboard from "./ExpenseDashboard"
import ExpenseDetailView from "./ExpenseDetailView"

function UserDashboard({ user = { name: "Guest" }, onNavigate }) {

  const [showForm, setShowForm] = useState(false)
  const [showExpenses, setShowExpenses] = useState(false)
  const [showExpenseDetails, setShowExpenseDetails] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (

    <div className="dashboard" style={darkMode ? { background: '#1a1f2e', color: '#e8edf5' } : {}}>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        onNavigate={onNavigate}
        openDashboard={() => {
          setShowForm(false)
          setShowExpenses(false)
          setShowExpenseDetails(false)
        }}
        openForm={() => {
          setShowForm(true)
          setShowExpenses(false)
          setShowExpenseDetails(false)
        }}
        openExpenses={() => {
          setShowExpenses(true)
          setShowForm(false)
          setShowExpenseDetails(false)
        }}
      />

      {/* Main Panel */}
      <div className="dashboardRightPanel">

        <DashboardNavbar
          name={user.name}
          openSidebar={() => setSidebarOpen(true)}
          darkMode={darkMode}
          toggleTheme={() => setDarkMode(prev => !prev)}
          openForm={() => {
            setShowForm(true)
            setShowExpenses(false)
            setShowExpenseDetails(false)
          }}
          openExpenses={() => {
            setShowExpenses(true)
            setShowForm(false)
            setShowExpenseDetails(false)
          }}
        />

        <main className="dashboardMain">
          <div className="dashboardContent">

            {/* SHOW FORM */}
            {showForm && (
              <div className="formWrapper">
                <button
                  className="backBtn"
                  onClick={() => setShowForm(false)}
                >
                  ← Back to Dashboard
                </button>
                <ExpenseForm user={user} />
              </div>
            )}

            {/* SHOW EXPENSE DASHBOARD */}
            {showExpenses && !showExpenseDetails && (
              <div className="formWrapper">
                <button
                  className="backBtn"
                  onClick={() => setShowExpenses(false)}
                >
                  ← Back to Dashboard
                </button>
                <ExpenseDashboard 
                  onViewDetails={() => {
                    setShowExpenses(false)
                    setShowExpenseDetails(true)
                  }}
                />
              </div>
            )}

            {/* SHOW EXPENSE DETAIL VIEW */}
            {showExpenseDetails && (
              <div className="formWrapper">
                <ExpenseDetailView 
                  onBack={() => {
                    setShowExpenseDetails(false)
                    setShowExpenses(true)
                  }}
                />
              </div>
            )}

            {/* DEFAULT DASHBOARD */}
            {!showForm && !showExpenses && !showExpenseDetails && (
              <>
                <SummaryCards />

                <FeatureButtons
                  openForm={() => {
                    setShowForm(true)
                    setShowExpenses(false)
                    setShowExpenseDetails(false)
                  }}
                  openExpenses={() => {
                    setShowExpenses(true)
                    setShowForm(false)
                    setShowExpenseDetails(false)
                  }}
                  openExpenseDetails={() => {
                    setShowExpenseDetails(true)
                    setShowExpenses(false)
                    setShowForm(false)
                  }}
                />

                <ExpenseList />
              </>
            )}

          </div>
        </main>

        <Footer />

      </div>

    </div>

  )
}

export default UserDashboard
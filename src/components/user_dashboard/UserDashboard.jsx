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

function UserDashboard({ onNavigate }) {

  const [showForm, setShowForm] = useState(false)
  const [showExpenses, setShowExpenses] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const openSidebar = () => {
    setSidebarOpen(true)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (

    <div className="dashboard">

      <DashboardNavbar
        name="Muskan"
        openSidebar={openSidebar}
        openForm={() => setShowForm(true)}
      />

      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={closeSidebar}
        onNavigate={onNavigate}
      />

      <div className="dashboardContent">

        {showForm ? (

          <div className="formWrapper">
            <button
              className="backBtn"
              onClick={() => setShowForm(false)}
            >
              ← Back to Dashboard
            </button>

            <ExpenseForm />

          </div>

        ) : showExpenses ? (

          <div className="formWrapper">
            <button
              className="backBtn"
              onClick={() => setShowExpenses(false)}
            >
              ← Back to Dashboard
            </button>

            <ExpenseDashboard />

          </div>

        ) : (

          <>
            <SummaryCards />

            <FeatureButtons
              openForm={() => setShowForm(true)}
              openExpenses={() => setShowExpenses(true)}
            />

            <ExpenseList />
          </>

        )}

      </div>

      <Footer />

    </div>

  )
}

export default UserDashboard
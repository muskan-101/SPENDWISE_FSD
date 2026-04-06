import "./FeatureButtons.css"

function FeatureButtons({ openForm, openExpenses, openExpenseDetails }){

  return(

    <div className="features">

      <div className="featureCard">
        <h3>Submit Expense Report</h3>
        <p>Upload bills and expense details</p>
        <button onClick={openForm}>Submit</button>
      </div>

      <div className="featureCard">
        <h3>My Expenses Dashboard</h3>
        <p>View all submitted expenses</p>
        <button onClick={openExpenses}>View</button>
      </div>

      <div className="featureCard">
        <h3>Expense Detail View</h3>
        <p>Check admin remarks and status</p>
        <button onClick={openExpenseDetails}>Open</button>
      </div>

    </div>

  )
}

export default FeatureButtons
import "./SummaryCards.css"

function SummaryCards(){

  return(

    <div className="summaryContainer">

      <div className="message">
        Ready to manage your expenses?
      </div>

      <div className="card">
        <h3>Total Expenses Submitted</h3>
        <p>0</p>
      </div>

      <div className="card">
        <h3>Approved Expenses</h3>
        <p>0</p>
      </div>

      <div className="card">
        <h3>Pending Approval</h3>
        <p>0</p>
      </div>

      <div className="card">
        <h3>Download Records</h3>
        <button>Download</button>
      </div>

    </div>

  )
}

export default SummaryCards
import "./Features.css"

function Features(){
  return(

    <section className="features">

      <h2>Everything you need in one place</h2>

      <p className="subtitle">
        Stop using messy spreadsheets. SpendWise is designed specifically for
        university student leaders.
      </p>

      <div className="cards">

        <div className="card">
          <h3>Real-time tracking</h3>
          <p>Monitor every cent spent as it happens during your events.</p>
        </div>

        <div className="card">
          <h3>Expense Approval</h3>
          <p>Streamline reimbursements and club purchases with digital approvals.</p>
        </div>

        <div className="card">
          <h3>Budget Reporting</h3>
          <p>Generate professional financial reports in one click.</p>
        </div>

      </div>

    </section>

  )
}

export default Features
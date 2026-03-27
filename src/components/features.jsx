import "./features.css"

function Features() {
  return (
    <section className="features">
      <div className="features-container">

        <div className="features-header">
          <h1>Everthing You Need In One Place</h1>
          <p className="subtitle">
            <i>Stop using messy spreadsheets and scattered emails. SpendWise brings everything you need into one simple, powerful platform.</i>
          </p>
        </div>

        <div className="features-grid">
          <div className="info-card">
            <h3 className="card-title">Real-time tracking</h3>
            <p className="card-desc">Monitor every cent spent as it happens during your events.</p>
          </div>

          <div className="info-card">
            <h3 className="card-title">Expense Approval</h3>
            <p className="card-desc">Streamline reimbursements and club purchases with digital approvals.</p>
          </div>

          <div className="info-card">
            <h3 className="card-title">Budget Reporting</h3>
            <p className="card-desc">Generate professional financial reports in one click.</p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Features
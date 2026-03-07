import "./Hero.css"

function Hero({ onNavigate }) {
  return (

    <section className="hero">

      <p className="tag">BUILT FOR STUDENT CLUBS</p>

      <h1>
        Master Your Club's Budget <br />
        with <span>Ease</span>
      </h1>

      <p className="desc">
        Track event expenses, manage approvals, and stay on budget with the most
        intuitive financial tool for college student organizations.
      </p>

      <div className="buttons">

        <button className="user-btn" onClick={() => onNavigate('login', 'user')}>USER LOGIN</button>

        <button className="admin-btn" onClick={() => onNavigate('login', 'admin')}>ADMIN LOGIN</button>

      </div>

    </section>

  )
}

export default Hero
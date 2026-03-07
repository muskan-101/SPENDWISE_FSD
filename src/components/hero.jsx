import "./Hero.css"

function Hero(){
  return(

    <section className="hero">

      <p className="tag">BUILT FOR STUDENT CLUBS</p>

      <h1>
        Master Your Club's Budget <br/>
        with <span>Ease</span>
      </h1>

      <p className="desc">
        Track event expenses, manage approvals, and stay on budget with the most
        intuitive financial tool for college student organizations.
      </p>

      <div className="buttons">

        <button className="user-btn">USER LOGIN</button>

        <button className="admin-btn">ADMIN LOGIN</button>

      </div>

    </section>

  )
}

export default Hero
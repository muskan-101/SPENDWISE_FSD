import "./Hero.css";
import heroVideo from "../assets/video.mp4";

function Hero({ onNavigate }) {
  return (
    <section className="hero">

      {/* ── Video Background ── */}
      <video
        className="hero-video"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ── Dark Overlay ── */}
      <div className="hero-overlay" />

      {/* ── Content ── */}
      <div className="hero-content">
        <p className="tag">✦ Built for Student Clubs</p>

        <h1>
          Master Your Club's Budget <br />
          with <span>Ease</span>
        </h1>

        <p className="desc">
          Track event expenses, manage approvals, and stay on budget with the
          most intuitive financial tool for college student organizations.
        </p>

        <div className="buttons">
          <button className="user-btn" onClick={() => onNavigate('login', 'user')}>
            🎓 User Login
          </button>
          <button className="admin-btn" onClick={() => onNavigate('login', 'admin')}>
            🛡️ Admin Login
          </button>
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="hero-scroll-hint">
        <span>Scroll</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

    </section>
  );
}

export default Hero;
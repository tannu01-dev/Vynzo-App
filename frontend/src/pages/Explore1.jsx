
import { Link } from "react-router-dom";
import "../styles/explore1.css";

function Explore() {
  return (
    <div className="explore-page">

      <nav className="explore-navbar">
        <Link to="/" className="explore-logo">
          VYNZO
        </Link>

        <div className="explore-nav-links">
          <Link to="/explore" className="active">
            Explore
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/login">
            Login
          </Link>
        </div>
      </nav>

      <main className="explore-container">

        <section className="explore-hero">
          <p className="explore-small-title">
            DISCOVER VYNZO
          </p>

          <h1>
            Explore.
            <br />
            <span>Discover. Connect.</span>
          </h1>

          <p>
            Discover new people, trending moments,
            creative content and amazing stories
            from the Vynzo community.
          </p>

          <Link to="/login" className="explore-btn">
            Join Vynzo →
          </Link>
        </section>

        <section className="explore-features">

          <div className="explore-card">
            <div className="explore-icon">📸</div>
            <h3>Discover Posts</h3>
            <p>
              Explore photos and moments shared
              by people around you.
            </p>
          </div>

          <div className="explore-card">
            <div className="explore-icon">🎬</div>
            <h3>Watch Reels</h3>
            <p>
              Find entertaining and creative
              short videos on Vynzo.
            </p>
          </div>

          <div className="explore-card">
            <div className="explore-icon">✨</div>
            <h3>Meet People</h3>
            <p>
              Discover new creators and connect
              with people who share your interests.
            </p>
          </div>

        </section>

        <section className="explore-trending">

          <div className="section-title">
            <h2>Trending on Vynzo</h2>
            <span>Explore what's happening</span>
          </div>

          <div className="trend-grid">

            <div className="trend-card trend-one">
              <span>✨</span>
              <h3>Moments</h3>
              <p>Share your everyday life</p>
            </div>

            <div className="trend-card trend-two">
              <span>🎥</span>
              <h3>Reels</h3>
              <p>Watch something entertaining</p>
            </div>

            <div className="trend-card trend-three">
              <span>💫</span>
              <h3>Creators</h3>
              <p>Discover new personalities</p>
            </div>

            <div className="trend-card trend-four">
              <span>❤️</span>
              <h3>Community</h3>
              <p>Connect with your people</p>
            </div>

          </div>

        </section>

      </main>

      <footer className="explore-footer">
        © 2026 Vynzo · About · Privacy · Terms
      </footer>

    </div>
  );
}

export default Explore;


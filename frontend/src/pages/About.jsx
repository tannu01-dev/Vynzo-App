
import { Link } from "react-router-dom";
import "../styles/about.css";

function About() {
  return (
    <div className="about-page">

      <nav className="about-navbar">

        <Link to="/" className="about-logo">
          VYNZO
        </Link>

        <div className="about-nav-links">

          <Link to="/explore">
            Explore
          </Link>

          <Link to="/about" className="active">
            About
          </Link>

          <Link to="/login">
            Login
          </Link>

        </div>

      </nav>

      <main className="about-container">

        <section className="about-hero">

          <p className="about-small-title">
            ABOUT VYNZO
          </p>

          <h1>
            Your world.
            <br />
            <span>Your people.</span>
          </h1>

          <p className="about-intro">
            Vynzo is a social platform built to help
            people share their moments, discover new
            experiences and connect with the people
            who matter to them.
          </p>

        </section>

        <section className="about-content">

          <div className="about-card">

            <div className="about-number">
              01
            </div>

            <div>
              <h2>Share Your Moments</h2>

              <p>
                Upload photos, videos and stories.
                Let your friends and followers see
                what's happening in your world.
              </p>
            </div>

          </div>

          <div className="about-card">

            <div className="about-number">
              02
            </div>

            <div>
              <h2>Connect With People</h2>

              <p>
                Follow people you like, interact with
                their posts and build your own
                community on Vynzo.
              </p>
            </div>

          </div>

          <div className="about-card">

            <div className="about-number">
              03
            </div>

            <div>
              <h2>Discover Something New</h2>

              <p>
                Explore posts, watch reels and
                discover creators and communities
                that match your interests.
              </p>
            </div>

          </div>

        </section>

        <section className="about-mission">

          <p>OUR MISSION</p>

          <h2>
            Make social media feel
            <span> more human.</span>
          </h2>

          <p className="mission-text">
            Vynzo is designed around people,
            creativity and genuine connections.
            We're building a place where sharing
            feels natural and discovering people
            feels exciting.
          </p>

          <Link to="/login" className="about-btn">
            Start Your Vynzo Journey →
          </Link>

        </section>

      </main>

      <footer className="about-footer">
        © 2026 Vynzo · Explore · Privacy · Terms
      </footer>

    </div>
  );
}

export default About;


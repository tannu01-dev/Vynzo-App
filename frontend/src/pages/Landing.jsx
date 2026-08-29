
// import { Link } from "react-router-dom";

// function Landing() {
//   return (
//     <div className="landing-page">

//       {/* Navbar */}
//       <nav className="navbar">
//         <div className="logo">VYNZO</div>

//         <div className="nav-links">
//           <a href="#explore">Explore</a>
//           <a href="#about">About</a>
//           <Link to="/login">Login</Link>
//         </div>

//         <Link to="/login" className="get-started">
//           Get Started
//         </Link>
//       </nav>

//       {/* Hero */}
//       <section className="hero">

//         <div className="hero-text">
//           <p className="small-title">YOUR SOCIAL WORLD</p>

//           <h1>
//             Share your world.
//             <br />
//             <span>Connect with your people.</span>
//           </h1>

//           <p className="description">
//             Share photos, videos and moments.
//             Discover people and enjoy your social world
//             with Vynzo.
//           </p>

//           <div className="buttons">
//             <Link to="/login" className="primary-btn">
//               Get Started →
//             </Link>

//             <a href="#explore" className="secondary-btn">
//               Explore Vynzo
//             </a>
//           </div>
//         </div>

//         {/* Social Preview */}
//         <div className="social-preview">

//           {/* Story Left */}
//           <div className="story story-left">
//             <div className="story-ring">
//               <div className="story-user">T</div>
//             </div>
//             <p>Your Story</p>
//           </div>

//           {/* Main Post */}
//           <div className="post-card">

//             <div className="post-header">
//               <div className="profile">
//                 <div className="profile-img">T</div>

//                 <div>
//                   <strong>tannu.vynzo</strong>
//                   <small>Just now</small>
//                 </div>
//               </div>

//               <span>•••</span>
//             </div>

//             <div className="post-image">
//               <div>
//                 <small>WELCOME TO</small>
//                 <h2>VYNZO</h2>
//                 <p>Share your moment ✨</p>
//               </div>
//             </div>

//             <div className="post-buttons">
//               <span>♡</span>
//               <span>💬</span>
//               <span>↗</span>
//               <span className="save">♡</span>
//             </div>

//             <div className="post-content">
//               <strong>1,284 likes</strong>

//               <p>
//                 <b>tannu.vynzo</b> Life looks better
//                 when you share it. ✨
//               </p>
//             </div>

//           </div>

//           {/* Story Right */}
//           <div className="story story-right">
//             <div className="story-ring">
//               <div className="story-user">A</div>
//             </div>
//             <p>Alex</p>
//           </div>

//           {/* Reel */}
//           <div className="reel-card">

//             <div className="reel-image">
//               <div className="play">▶</div>
//               <span>REELS</span>
//             </div>

//             <div className="reel-text">
//               <strong>Discover something new</strong>
//               <small>Watch • Like • Share</small>
//             </div>

//           </div>

//           {/* Notification */}
//           <div className="notification">

//             <div className="notification-icon">
//               ♥
//             </div>

//             <div>
//               <strong>New Like</strong>
//               <small>Someone liked your post</small>
//             </div>

//           </div>

//         </div>

//       </section>

//       {/* Bottom */}
//       <div className="bottom-text">
//         YOUR MOMENTS · YOUR PEOPLE · YOUR VYNZO
//       </div>

//     </div>
//   );
// }

// export default Landing;




import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          VYNZO
        </Link>

        <div className="nav-links">
          <Link to="/explore1">Explore</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
        </div>

        <Link to="/login" className="get-started">
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="hero">

        <div className="hero-text">
          <p className="small-title">YOUR SOCIAL WORLD</p>

          <h1>
            Share your world.
            <br />
            <span>Connect with your people.</span>
          </h1>

          <p className="description">
            Share photos, videos and moments.
            Discover people and enjoy your social world
            with Vynzo.
          </p>

          <div className="buttons">
            <Link to="/login" className="primary-btn">
              Get Started →
            </Link>

            <Link to="/explore" className="secondary-btn">
              Explore Vynzo
            </Link>
          </div>
        </div>

        {/* Social Preview */}
        <div className="social-preview">

          <div className="story story-left">
            <div className="story-ring">
              <div className="story-user">T</div>
            </div>
            <p>Your Story</p>
          </div>

          <div className="post-card">

            <div className="post-header">
              <div className="profile">
                <div className="profile-img">T</div>

                <div>
                  <strong>tannu.vynzo</strong>
                  <small>Just now</small>
                </div>
              </div>

              <span>•••</span>
            </div>

            <div className="post-image">
              <div>
                <small>WELCOME TO</small>
                <h2>VYNZO</h2>
                <p>Share your moment ✨</p>
              </div>
            </div>

            <div className="post-buttons">
              <span>♡</span>
              <span>💬</span>
              <span>↗</span>
              <span className="save">♡</span>
            </div>

            <div className="post-content">
              <strong>1,284 likes</strong>

              <p>
                <b>tannu.vynzo</b> Life looks better
                when you share it. ✨
              </p>
            </div>

          </div>

          <div className="story story-right">
            <div className="story-ring">
              <div className="story-user">A</div>
            </div>
            <p>Alex</p>
          </div>

          <div className="reel-card">

            <div className="reel-image">
              <div className="play">▶</div>
              <span>REELS</span>
            </div>

            <div className="reel-text">
              <strong>Discover something new</strong>
              <small>Watch • Like • Share</small>
            </div>

          </div>

          <div className="notification">

            <div className="notification-icon">
              ♥
            </div>

            <div>
              <strong>New Like</strong>
              <small>Someone liked your post</small>
            </div>

          </div>

        </div>

      </section>

      <div className="bottom-text">
        YOUR MOMENTS · YOUR PEOPLE · YOUR VYNZO
      </div>

    </div>
  );
}

export default Landing;


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import "../styles/profile.css";

function Profile() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  // =====================================
  // FETCH POSTS
  // =====================================

  const fetchPosts = async () => {

    try {

      setLoading(true);

      const res = await API.get("/posts");

      if (res.data.success) {

        // Sirf current user ke posts
        const myPosts = res.data.posts.filter(
          (post) =>
            post.user?._id === user?.id ||
            post.user?._id === user?._id
        );

        setPosts(myPosts);
      }

    } catch (error) {

      console.log(
        "PROFILE POSTS ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchPosts();

  }, []);


  // =====================================
  // MEDIA URL
  // =====================================

  const getMediaUrl = (media) => {

    if (!media) return "";

    if (media.startsWith("http")) {
      return media;
    }

    return `https://vynzo-app.onrender.com${media}`;
  };


  return (

    <div className="profile-page">


      {/* =================================
          NAVBAR
      ================================= */}

      <nav className="profile-navbar">

        <Link
          to="/home"
          className="profile-logo"
        >
          VYNZO
        </Link>


        <div className="profile-nav-links">

          <Link to="/home">
            Home
          </Link>

          <Link to="/explore">
            Explore
          </Link>

          <Link to="/reels">
            Reels
          </Link>

        </div>

      </nav>


      {/* =================================
          PROFILE
      ================================= */}

      <main className="profile-container">


        <section className="profile-header">


          {/* AVATAR */}

          <div className="profile-big-avatar">

            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}

          </div>


          {/* PROFILE INFO */}

          <div className="profile-info">


            <div className="profile-name-row">

              <h1>
                {user?.username || "username"}
              </h1>

              <button className="edit-profile-button">
                Edit Profile
              </button>

            </div>


            {/* STATS */}

            <div className="profile-stats">


              <div>

                <strong>
                  {posts.length}
                </strong>

                <span>
                  Posts
                </span>

              </div>


              <div>

                <strong>
                  0
                </strong>

                <span>
                  Followers
                </span>

              </div>


              <div>

                <strong>
                  0
                </strong>

                <span>
                  Following
                </span>

              </div>


            </div>


            {/* BIO */}

            <div className="profile-bio">

              <strong>
                {user?.name || "Vynzo User"}
              </strong>

              <p>
                Welcome to my Vynzo profile ✨
              </p>

            </div>

          </div>

        </section>


        {/* =================================
            TABS
        ================================= */}

        <div className="profile-tabs">

          <button className="active">
            ▦ POSTS
          </button>

          <button>
            🎬 REELS
          </button>

          <button>
            🔖 SAVED
          </button>

        </div>


        {/* =================================
            POSTS
        ================================= */}

        <section className="profile-posts">


          {loading ? (

            <div className="empty-profile">

              <div className="empty-icon">
                ⏳
              </div>

              <h2>
                Loading posts...
              </h2>

            </div>

          ) : posts.length === 0 ? (

            <div className="empty-profile">

              <div className="empty-icon">
                📷
              </div>

              <h2>
                No Posts Yet
              </h2>

              <p>
                When you share photos or videos,
                they'll appear here.
              </p>

              <Link
                to="/home"
                className="create-post-link"
              >
                Create your first post
              </Link>

            </div>

          ) : (

            <div className="profile-post-grid">

              {posts.map((post) => (

                <div
                  className="profile-post-item"
                  key={post._id}
                >


                  {/* IMAGE */}

                  {post.mediaType === "image" && (

                    <img
                      src={getMediaUrl(post.media)}
                      alt="Vynzo post"
                    />

                  )}


                  {/* VIDEO */}

                  {post.mediaType === "video" && (

                    <video
                      src={getMediaUrl(post.media)}
                      muted
                      controls
                      playsInline
                    />

                  )}


                  {/* OVERLAY */}

                  <div className="profile-post-overlay">

                    <span>
                      ❤️ {post.likes?.length || 0}
                    </span>

                    <span>
                      💬 {post.comments?.length || 0}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Profile;
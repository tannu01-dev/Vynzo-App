import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/explore.css";

function Explore() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH POSTS
  // =========================
  const fetchPosts = async () => {
    try {
      setLoading(true);

      const res = await API.get("/posts");

      console.log("EXPLORE POSTS:", res.data);

      if (res.data.success) {
        setPosts(res.data.posts || []);
      }
    } catch (error) {
      console.log("EXPLORE POSTS ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // =========================
  // MEDIA URL
  // =========================
  const getMediaUrl = (media) => {
    if (!media) return "";

    if (media.startsWith("http")) {
      return media;
    }

    return `https://vynzo-app.onrender.com${media}`;
  };

  // =========================
  // SEARCH
  // =========================
  const filteredPosts = posts.filter((post) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    const caption =
      post.caption?.toLowerCase() || "";

    const username =
      post.user?.username?.toLowerCase() || "";

    const name =
      post.user?.name?.toLowerCase() || "";

    return (
      caption.includes(query) ||
      username.includes(query) ||
      name.includes(query)
    );
  });

  return (
    <div className="explore-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="explore-header">

        <div className="explore-title">
          <h1>Explore</h1>

          <p>
            Discover posts from the Vynzo community
          </p>
        </div>

        <div className="explore-search">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search posts or users..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}

        </div>

      </header>


      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="explore-message">

          <div className="loader"></div>

          <p>
            Loading posts...
          </p>

        </div>
      )}


      {/* =========================
          NO POSTS
      ========================= */}

      {!loading && posts.length === 0 && (

        <div className="explore-message">

          <div className="message-icon">
            📸
          </div>

          <h2>No posts yet</h2>

          <p>
            Be the first one to share something
            on Vynzo.
          </p>

        </div>
      )}


      {/* =========================
          NO SEARCH RESULTS
      ========================= */}

      {!loading &&
        posts.length > 0 &&
        filteredPosts.length === 0 && (

          <div className="explore-message">

            <div className="message-icon">
              🔎
            </div>

            <h2>No results found</h2>

            <p>
              Try searching for another user
              or keyword.
            </p>

          </div>
        )}


      {/* =========================
          POSTS GRID
      ========================= */}

      {!loading &&
        filteredPosts.length > 0 && (

          <main className="explore-grid">

            {filteredPosts.map((post) => (

              <article
                className="explore-card"
                key={post._id}
              >

                {/* IMAGE POST */}

                {post.mediaType === "image" &&
                  post.media && (

                    <img
                      src={getMediaUrl(post.media)}
                      alt={
                        post.caption ||
                        "Vynzo post"
                      }
                      className="explore-media"
                    />
                  )}


                {/* VIDEO POST */}

                {post.mediaType === "video" &&
                  post.media && (

                    <video
                      src={getMediaUrl(post.media)}
                      className="explore-media"
                      muted
                      loop
                      playsInline
                      controls
                    />
                  )}


                {/* FALLBACK */}

                {!post.media && (

                  <div className="explore-text-post">

                    <p>
                      {post.caption ||
                        "Vynzo Post"}
                    </p>

                  </div>
                )}


                {/* =========================
                    HOVER OVERLAY
                ========================= */}

                <div className="explore-overlay">

                  <div className="explore-user">

                    <div className="explore-avatar">

                      {post.user?.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}

                    </div>

                    <div>

                      <strong>
                        {post.user?.name ||
                          "Vynzo User"}
                      </strong>

                      <span>
                        @
                        {post.user?.username ||
                          "user"}
                      </span>

                    </div>

                  </div>


                  <div className="explore-stats">

                    <span>
                      ❤️{" "}
                      {post.likes?.length || 0}
                    </span>

                    <span>
                      💬{" "}
                      {post.comments?.length ||
                        0}
                    </span>

                  </div>

                </div>

              </article>

            ))}

          </main>
        )}

    </div>
  );
}

export default Explore;
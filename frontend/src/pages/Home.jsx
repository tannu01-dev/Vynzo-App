import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log("CURRENT USER:", user);

  // =====================================
  // POST STATES
  // =====================================

  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);

  const [commentText, setCommentText] = useState({});

  // =====================================
  // SUGGESTIONS
  // =====================================

  const [suggestions, setSuggestions] = useState([]);
  const [followLoading, setFollowLoading] = useState({});

  // =====================================
  // STORY STATES
  // =====================================

  const storyInputRef = useRef(null);

  const storyVideoRef = useRef(null);
  const storyStreamRef = useRef(null);
  const storyRecorderRef = useRef(null);
  const storyTimerRef = useRef(null);

  const [stories, setStories] = useState([]);

  const [showStoryCreate, setShowStoryCreate] = useState(false);
  const [showStoryCamera, setShowStoryCamera] = useState(false);

  const [selectedStory, setSelectedStory] = useState(null);
  const [storyPreview, setStoryPreview] = useState("");

  const [storyCaption, setStoryCaption] = useState("");

  const [storyRecording, setStoryRecording] = useState(false);
  const [storyRecordingTime, setStoryRecordingTime] = useState(0);

  const [storyUploading, setStoryUploading] = useState(false);

  const [viewingStory, setViewingStory] = useState(null);

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

  // =====================================
  // CHECK CURRENT USER
  // =====================================

  const getCurrentUserId = () => {
    return user?._id || user?.id || user?.userId;
  };

  // =====================================
  // CHECK POST OWNER
  // =====================================

  const isMyPost = (post) => {
    const currentUserId = getCurrentUserId();

    let postUserId = null;

    if (post?.user?._id) {
      postUserId = post.user._id;
    } else if (post?.user?.id) {
      postUserId = post.user.id;
    } else if (typeof post?.user === "string") {
      postUserId = post.user;
    } else if (post?.userId) {
      postUserId = post.userId;
    }

    const result =
      currentUserId &&
      postUserId &&
      String(currentUserId) === String(postUserId);

    console.log("DELETE CHECK:", {
      postId: post?._id,
      currentUserId,
      postUserId,
      isMyPost: result,
    });

    return Boolean(result);
  };

  // =====================================
  // FETCH POSTS
  // =====================================

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);

      const res = await API.get("/posts");

      if (res.data.success) {
        const allPosts = res.data.posts || [];

        const normalPosts = allPosts.filter(
          (post) => post.postType !== "story"
        );

        setPosts(normalPosts);

        const realStories = allPosts.filter(
          (post) => post.postType === "story"
        );

        setStories(realStories);
      }
    } catch (error) {
      console.log("FETCH POSTS ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      }
    } finally {
      setPostsLoading(false);
    }
  };

  // =====================================
  // FETCH SUGGESTIONS
  // =====================================

  const fetchSuggestions = async () => {
    try {
      const res = await API.get("/users/suggestions");

      if (res.data.success) {
        setSuggestions(res.data.users || []);
      }
    } catch (error) {
      console.log("SUGGESTIONS ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      }
    }
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    fetchPosts();
    fetchSuggestions();

    return () => {
      stopStoryCamera();
    };
  }, []);

  // =====================================
  // POST MEDIA CHANGE
  // =====================================

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMedia(file);
  };

  // =====================================
  // CREATE POST
  // =====================================

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!media) {
      alert("Please select a photo or video");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("media", media);
      formData.append("caption", caption);
      formData.append("postType", "post");

      const res = await API.post("/posts", formData);

      if (res.data.success) {
        setCaption("");
        setMedia(null);

        const mediaInput = document.getElementById("mediaInput");
        const videoInput = document.getElementById("videoInput");

        if (mediaInput) {
          mediaInput.value = "";
        }

        if (videoInput) {
          videoInput.value = "";
        }

        alert("Post created successfully 🎉");

        fetchPosts();
      }
    } catch (error) {
      console.log("CREATE POST ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =====================================
  // LIKE
  // =====================================

  const handleLike = async (postId) => {
    try {
      const res = await API.put(`/posts/${postId}/like`);

      if (res.data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === postId) {
              return {
                ...post,
                likes: Array(res.data.likes).fill("like"),
              };
            }

            return post;
          })
        );
      }
    } catch (error) {
      console.log("LIKE ERROR:", error);
    }
  };

  // =====================================
  // COMMENT
  // =====================================

  const handleComment = async (postId) => {
    const text = commentText[postId];

    if (!text || !text.trim()) {
      return;
    }

    try {
      const res = await API.post(
        `/posts/${postId}/comment`,
        {
          text: text.trim(),
        }
      );

      if (res.data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? res.data.post : post
          )
        );

        setCommentText((prev) => ({
          ...prev,
          [postId]: "",
        }));
      }
    } catch (error) {
      console.log("COMMENT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    }
  };

  // =====================================
  // SHARE
  // =====================================

  const handleShare = async (postId) => {
    const shareUrl =
      `${window.location.origin}/post/${postId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Vynzo Post",
          text: "Check out this post on Vynzo ✨",
          url: shareUrl,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);

        alert("Post link copied! 🔗");
      } catch (error) {
        console.log("SHARE ERROR:", error);

        alert("Unable to share post");
      }
    }
  };

  // =====================================
  // DELETE POST
  // =====================================

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await API.delete(`/posts/${postId}`);

      console.log("DELETE RESPONSE:", res.data);

      if (res.data.success) {
        setPosts((prevPosts) =>
          prevPosts.filter(
            (post) => post._id !== postId
          )
        );

        alert("Post deleted successfully 🗑️");
      }
    } catch (error) {
      console.log("DELETE POST ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete post"
      );
    }
  };

  // =====================================
  // FOLLOW
  // =====================================

  const handleFollow = async (userId) => {
    try {
      setFollowLoading((prev) => ({
        ...prev,
        [userId]: true,
      }));

      const res = await API.put(
        `/users/${userId}/follow`
      );

      if (res.data.success) {
        setSuggestions((prev) =>
          prev.map((suggestion) =>
            suggestion._id === userId
              ? {
                  ...suggestion,
                  isFollowing: res.data.following,
                  followersCount: res.data.followers,
                }
              : suggestion
          )
        );
      }
    } catch (error) {
      console.log("FOLLOW ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to follow user"
      );
    } finally {
      setFollowLoading((prev) => ({
        ...prev,
        [userId]: false,
      }));
    }
  };

  // =====================================
  // STORY FILE SELECT
  // =====================================

  const handleStoryFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("video/")
    ) {
      alert("Please select an image or video.");
      return;
    }

    setSelectedStory(file);

    const url = URL.createObjectURL(file);

    setStoryPreview(url);

    setShowStoryCreate(true);
  };

  // =====================================
  // OPEN STORY CREATE
  // =====================================

  const openStoryCreate = () => {
    setShowStoryCreate(true);
  };

  // =====================================
  // OPEN STORY CAMERA
  // =====================================

  const openStoryCamera = async () => {
    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert(
          "Camera is not supported by this browser."
        );

        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: true,
        });

      storyStreamRef.current = stream;

      setShowStoryCreate(false);
      setShowStoryCamera(true);

      setTimeout(() => {
        if (storyVideoRef.current) {
          storyVideoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.log("STORY CAMERA ERROR:", error);

      if (error.name === "NotAllowedError") {
        alert(
          "Camera permission denied. Please allow camera access."
        );
      } else if (error.name === "NotFoundError") {
        alert(
          "No camera was found on this device."
        );
      } else {
        alert("Unable to open camera.");
      }
    }
  };

  // =====================================
  // STOP STORY CAMERA
  // =====================================

  const stopStoryCamera = () => {
    if (storyTimerRef.current) {
      clearInterval(storyTimerRef.current);

      storyTimerRef.current = null;
    }

    if (storyStreamRef.current) {
      storyStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      storyStreamRef.current = null;
    }

    if (storyVideoRef.current) {
      storyVideoRef.current.srcObject = null;
    }

    setStoryRecording(false);
    setStoryRecordingTime(0);
  };

  // =====================================
  // START STORY RECORDING
  // =====================================

  const startStoryRecording = () => {
    if (!storyStreamRef.current) {
      alert("Camera is not ready.");
      return;
    }

    try {
      let mimeType = "";

      if (
        MediaRecorder.isTypeSupported(
          "video/webm;codecs=vp9,opus"
        )
      ) {
        mimeType = "video/webm;codecs=vp9,opus";
      } else if (
        MediaRecorder.isTypeSupported("video/webm")
      ) {
        mimeType = "video/webm";
      }

      const recorder = mimeType
        ? new MediaRecorder(
            storyStreamRef.current,
            { mimeType }
          )
        : new MediaRecorder(
            storyStreamRef.current
          );

      const chunks = [];

      storyRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: mimeType || "video/webm",
        });

        const file = new File(
          [blob],
          `vynzo-story-${Date.now()}.webm`,
          {
            type: mimeType || "video/webm",
          }
        );

        setSelectedStory(file);

        const url = URL.createObjectURL(blob);

        setStoryPreview(url);

        stopStoryCamera();

        setShowStoryCamera(false);
        setShowStoryCreate(true);
      };

      recorder.start();

      setStoryRecording(true);
      setStoryRecordingTime(0);

      storyTimerRef.current = setInterval(() => {
        setStoryRecordingTime(
          (previous) => previous + 1
        );
      }, 1000);
    } catch (error) {
      console.log("STORY RECORDING ERROR:", error);

      alert("Unable to start recording.");
    }
  };

  // =====================================
  // STOP STORY RECORDING
  // =====================================

  const stopStoryRecording = () => {
    if (
      storyRecorderRef.current &&
      storyRecorderRef.current.state !== "inactive"
    ) {
      storyRecorderRef.current.stop();
    }

    if (storyTimerRef.current) {
      clearInterval(storyTimerRef.current);

      storyTimerRef.current = null;
    }

    setStoryRecording(false);
  };

  // =====================================
  // STORY TIME
  // =====================================

  const formatStoryTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remaining = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remaining).padStart(2, "0")}`;
  };

  // =====================================
  // CLOSE STORY CREATE
  // =====================================

  const closeStoryCreate = () => {
    stopStoryCamera();

    if (storyPreview) {
      URL.revokeObjectURL(storyPreview);
    }

    setSelectedStory(null);
    setStoryPreview("");
    setStoryCaption("");

    setShowStoryCreate(false);
    setShowStoryCamera(false);

    if (storyInputRef.current) {
      storyInputRef.current.value = "";
    }
  };

  // =====================================
  // CREATE STORY
  // =====================================

  const handleCreateStory = async () => {
    if (!selectedStory) {
      alert(
        "Please select or record a story."
      );

      return;
    }

    try {
      setStoryUploading(true);

      const formData = new FormData();

      formData.append(
        "media",
        selectedStory
      );

      formData.append(
        "caption",
        storyCaption
      );

      formData.append(
        "postType",
        "story"
      );

      const res = await API.post(
        "/posts",
        formData
      );

      console.log(
        "CREATE STORY RESPONSE:",
        res.data
      );

      if (res.data.success) {
        alert(
          "Story uploaded successfully 🎉"
        );

        closeStoryCreate();

        fetchPosts();
      }
    } catch (error) {
      console.log(
        "CREATE STORY ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to upload story"
      );
    } finally {
      setStoryUploading(false);
    }
  };

  // =====================================
  // VIEW STORY
  // =====================================

  const openStoryViewer = (story) => {
    setViewingStory(story);
  };

  const closeStoryViewer = () => {
    setViewingStory(null);
  };

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="home-page">

      {/* =================================
          NAVBAR
      ================================= */}

      <nav className="home-navbar">

        <Link
          to="/home"
          className="home-logo"
        >
          VYNZO
        </Link>

        <div className="home-search">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search Vynzo..."
          />

        </div>

        <div className="home-nav-actions">

          <Link
            to="/home"
            className="nav-icon"
          >
            🏠
          </Link>

          <Link
            to="/explore"
            className="nav-icon"
          >
            🔍
          </Link>

          <Link
            to="/reels"
            className="nav-icon"
          >
            🎬
          </Link>

          <Link
            to="/profile"
            className="nav-profile"
          >
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </Link>

        </div>

      </nav>

      {/* =================================
          MAIN
      ================================= */}

      <main className="home-container">

        <section className="home-feed">

          {/* =================================
              STORIES
          ================================= */}

          <div className="stories-card">

            <div className="stories-header">

              <h3>Stories</h3>

              <span>
                {stories.length > 0
                  ? `${stories.length} stories`
                  : "No stories yet"}
              </span>

            </div>

            <div className="stories-list">

              {/* YOUR STORY */}

              <div
                className="story create-story"
                onClick={openStoryCreate}
              >

                <div className="story-avatar">
                  +
                </div>

                <p>Your story</p>

              </div>

              {/* REAL STORIES */}

              {stories.map((story, index) => (

                <div
                  className="story"
                  key={story._id}
                  onClick={() =>
                    openStoryViewer(story)
                  }
                >

                  <div
                    className={`story-avatar gradient-${
                      (index % 4) + 1
                    }`}
                  >

                    {story.mediaType === "image" ? (

                      <img
                        src={getMediaUrl(
                          story.media
                        )}
                        alt="Story"
                        className="story-thumbnail"
                      />

                    ) : (

                      <video
                        src={getMediaUrl(
                          story.media
                        )}
                        className="story-thumbnail"
                        muted
                        playsInline
                      />

                    )}

                  </div>

                  <p>
                    {String(story.user?._id) ===
                    String(getCurrentUserId())
                      ? "Your story"
                      : story.user?.name ||
                        "User"}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* =================================
              HIDDEN STORY INPUT
          ================================= */}

          <input
            ref={storyInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={handleStoryFileSelect}
          />

          {/* =================================
              CREATE POST
          ================================= */}

          <div className="create-post-card">

            <form
              onSubmit={handleCreatePost}
            >

              <div className="create-post-top">

                <div className="user-avatar">

                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}

                </div>

                <input
                  type="text"
                  placeholder="What's happening?"
                  value={caption}
                  onChange={(e) =>
                    setCaption(e.target.value)
                  }
                />

              </div>

              <div className="create-post-actions">

                <label className="media-button">

                  📷 Photo

                  <input
                    id="mediaInput"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={
                      handleMediaChange
                    }
                  />

                </label>

                <label className="media-button">

                  🎥 Video

                  <input
                    id="videoInput"
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={
                      handleMediaChange
                    }
                  />

                </label>

                <button
                  type="submit"
                  className="post-button"
                  disabled={loading}
                >
                  {loading
                    ? "Posting..."
                    : "Post"}
                </button>

              </div>

              {media && (
                <div className="selected-media">
                  📎 {media.name}
                </div>
              )}

            </form>

          </div>

          {/* =================================
              POSTS
          ================================= */}

          {postsLoading ? (

            <div className="post-card">

              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#777",
                }}
              >
                Loading posts...
              </div>

            </div>

          ) : posts.length === 0 ? (

            <div className="post-card">

              <div
                style={{
                  padding: "50px",
                  textAlign: "center",
                }}
              >

                <h3>
                  No posts yet
                </h3>

                <p
                  style={{
                    color: "#999",
                    fontSize: "12px",
                  }}
                >
                  Be the first person to
                  share something on
                  Vynzo ✨
                </p>

              </div>

            </div>

          ) : (

            posts.map((post) => (

              <article
                className="post-card"
                key={post._id}
              >

                {/* POST HEADER */}

                <div className="post-header">

                  <div className="post-user">

                    <div className="post-avatar gradient-1">

                      {post.user?.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}

                    </div>

                    <div>

                      <h4>
                        {post.user?.name ||
                          "Vynzo User"}
                      </h4>

                      <span>
                        @
                        {post.user?.username ||
                          "user"}
                        {" · "}
                        {new Date(
                          post.createdAt
                        ).toLocaleDateString()}
                      </span>

                    </div>

                  </div>

                  {/* =================================
                      DELETE BUTTON
                  ================================= */}

                  {isMyPost(post) && (

                    <div className="post-menu">

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDeletePost(
                            post._id
                          )
                        }
                        title="Delete post"
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  )}

                </div>

                {/* CAPTION */}

                {post.caption && (

                  <p className="post-text">
                    {post.caption}
                  </p>

                )}

                {/* IMAGE */}

                {post.mediaType === "image" && (

                  <img
                    src={getMediaUrl(
                      post.media
                    )}
                    alt="Post"
                    className="real-post-image"
                  />

                )}

                {/* VIDEO */}

                {post.mediaType === "video" && (

                  <video
                    src={getMediaUrl(
                      post.media
                    )}
                    className="real-post-video"
                    controls
                    playsInline
                  />

                )}

                {/* POST STATS */}

                <div className="post-stats">

                  <span>
                    ❤️{" "}
                    {post.likes?.length || 0}{" "}
                    likes
                  </span>

                  <span>
                    💬{" "}
                    {post.comments?.length || 0}{" "}
                    comments
                  </span>

                </div>

                {/* POST ACTIONS */}

                <div className="post-actions">

                  <button
                    type="button"
                    onClick={() =>
                      handleLike(post._id)
                    }
                  >
                    ❤️ Like
                  </button>

                  <button
                    type="button"
                    onClick={() => {

                      const input =
                        document.getElementById(
                          `comment-${post._id}`
                        );

                      if (input) {
                        input.focus();
                      }

                    }}
                  >
                    💬 Comment
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleShare(post._id)
                    }
                  >
                    ↗ Share
                  </button>

                </div>

                {/* COMMENT BOX */}

                <div className="comment-box">

                  <input
                    id={`comment-${post._id}`}
                    type="text"
                    placeholder="Write a comment..."
                    value={
                      commentText[
                        post._id
                      ] || ""
                    }
                    onChange={(e) =>
                      setCommentText(
                        (prev) => ({
                          ...prev,
                          [post._id]:
                            e.target.value,
                        })
                      )
                    }
                    onKeyDown={(e) => {

                      if (e.key === "Enter") {

                        e.preventDefault();

                        handleComment(
                          post._id
                        );

                      }

                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleComment(
                        post._id
                      )
                    }
                  >
                    Post
                  </button>

                </div>

                {/* COMMENTS */}

                {post.comments?.length > 0 && (

                  <div className="comments-list">

                    {post.comments.map(
                      (comment, index) => (

                        <div
                          className="comment"
                          key={
                            comment._id ||
                            index
                          }
                        >

                          <div className="comment-avatar">

                            {comment.user?.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}

                          </div>

                          <div className="comment-content">

                            <b>
                              {comment.user
                                ?.username ||
                                comment.user
                                  ?.name ||
                                "user"}
                            </b>

                            <span>
                              {comment.text}
                            </span>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </article>

            ))

          )}

        </section>

        {/* =================================
            SIDEBAR
        ================================= */}

        <aside className="home-sidebar">

          {/* PROFILE */}

          <div className="profile-mini">

            <div className="sidebar-avatar">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </div>

            <div>

              <h4>
                {user?.name ||
                  "Vynzo User"}
              </h4>

              <span>
                @
                {user?.username ||
                  "username"}
              </span>

            </div>

          </div>

          {/* SUGGESTIONS */}

          <div className="suggestions">

            <div className="suggestions-header">

              <h4>
                Suggested for you
              </h4>

              <span>
                See all
              </span>

            </div>

            {suggestions.length === 0 ? (

              <div
                style={{
                  padding: "15px 0",
                  color: "#999",
                  fontSize: "12px",
                }}
              >
                No suggestions available
              </div>

            ) : (

              suggestions.map(
                (suggestion, index) => (

                  <div
                    className="suggestion"
                    key={suggestion._id}
                  >

                    <div
                      className={`suggestion-avatar gradient-${
                        (index % 4) + 1
                      }`}
                    >
                      {suggestion.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}
                    </div>

                    <div className="suggestion-info">

                      <b>
                        {suggestion.name ||
                          "Vynzo User"}
                      </b>

                      <span>
                        @
                        {suggestion.username ||
                          "user"}
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleFollow(
                          suggestion._id
                        )
                      }
                      disabled={
                        followLoading[
                          suggestion._id
                        ]
                      }
                    >

                      {followLoading[
                        suggestion._id
                      ]
                        ? "..."
                        : suggestion.isFollowing
                        ? "Following"
                        : "Follow"}

                    </button>

                  </div>

                )
              )

            )}

          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            style={{
              marginTop: "25px",
              border: "none",
              background: "transparent",
              color: "#ef4444",
              fontSize: "11px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>

          <div className="sidebar-footer">
            © 2026 Vynzo · About · Privacy · Terms
          </div>

        </aside>

      </main>

      {/* =================================
          STORY CREATE MODAL
      ================================= */}

      {showStoryCreate && (

        <div className="story-modal-backdrop">

          <div className="story-modal">

            {!selectedStory ? (

              <>

                <div className="story-modal-header">

                  <div>

                    <h2>
                      Create a Story
                    </h2>

                    <p>
                      Share something with
                      your followers
                    </p>

                  </div>

                  <button
                    type="button"
                    className="story-close-button"
                    onClick={
                      closeStoryCreate
                    }
                  >
                    ×
                  </button>

                </div>

                <div className="story-create-options">

                  <button
                    type="button"
                    className="story-create-option"
                    onClick={() =>
                      storyInputRef.current?.click()
                    }
                  >

                    <div className="story-option-icon">
                      📁
                    </div>

                    <div>

                      <strong>
                        Upload from files
                      </strong>

                      <span>
                        Choose an image or video
                      </span>

                    </div>

                  </button>

                  <button
                    type="button"
                    className="story-create-option"
                    onClick={
                      openStoryCamera
                    }
                  >

                    <div className="story-option-icon">
                      📷
                    </div>

                    <div>

                      <strong>
                        Camera
                      </strong>

                      <span>
                        Record a new story
                      </span>

                    </div>

                  </button>

                </div>

              </>

            ) : (

              <>

                <div className="story-modal-header">

                  <div>

                    <h2>
                      New Story
                    </h2>

                    <p>
                      Preview your story
                    </p>

                  </div>

                  <button
                    type="button"
                    className="story-close-button"
                    onClick={
                      closeStoryCreate
                    }
                  >
                    ×
                  </button>

                </div>

                <div className="story-preview">

                  {selectedStory.type.startsWith(
                    "image/"
                  ) ? (

                    <img
                      src={storyPreview}
                      alt="Story preview"
                    />

                  ) : (

                    <video
                      src={storyPreview}
                      controls
                      autoPlay
                      muted
                      loop
                    />

                  )}

                </div>

                <textarea
                  className="story-caption-input"
                  placeholder="Write a caption..."
                  value={storyCaption}
                  onChange={(e) =>
                    setStoryCaption(
                      e.target.value
                    )
                  }
                  maxLength={500}
                />

                <div className="story-upload-actions">

                  <button
                    type="button"
                    className="story-cancel-button"
                    onClick={
                      closeStoryCreate
                    }
                    disabled={storyUploading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="story-post-button"
                    onClick={
                      handleCreateStory
                    }
                    disabled={storyUploading}
                  >
                    {storyUploading
                      ? "Uploading..."
                      : "Post Story"}
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}

      {/* =================================
          STORY CAMERA
      ================================= */}

      {showStoryCamera && (

        <div className="story-modal-backdrop">

          <div className="story-camera-modal">

            <div className="story-camera-header">

              <div>

                <h2>
                  Create Story
                </h2>

                <span>
                  {storyRecording
                    ? formatStoryTime(
                        storyRecordingTime
                      )
                    : "Camera"}
                </span>

              </div>

              <button
                type="button"
                className="story-close-button"
                onClick={() => {

                  stopStoryCamera();

                  setShowStoryCamera(false);

                  setShowStoryCreate(true);

                }}
              >
                ×
              </button>

            </div>

            <div className="story-camera-preview">

              <video
                ref={storyVideoRef}
                autoPlay
                muted
                playsInline
              />

              {storyRecording && (

                <div className="story-recording-indicator">

                  <span>
                    ●
                  </span>

                  Recording{" "}
                  {formatStoryTime(
                    storyRecordingTime
                  )}

                </div>

              )}

            </div>

            <div className="story-camera-controls">

              {!storyRecording ? (

                <button
                  type="button"
                  className="story-record-button"
                  onClick={
                    startStoryRecording
                  }
                >
                  <span>
                    ●
                  </span>
                </button>

              ) : (

                <button
                  type="button"
                  className="story-stop-record-button"
                  onClick={
                    stopStoryRecording
                  }
                >
                  ■
                </button>

              )}

            </div>

            <p className="story-camera-hint">

              {storyRecording
                ? "Tap to stop recording"
                : "Tap to start recording"}

            </p>

          </div>

        </div>

      )}

      {/* =================================
          STORY VIEWER
      ================================= */}

      {viewingStory && (

        <div
          className="story-viewer-backdrop"
          onClick={
            closeStoryViewer
          }
        >

          <div
            className="story-viewer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="story-viewer-close"
              onClick={
                closeStoryViewer
              }
            >
              ×
            </button>

            <div className="story-viewer-user">

              <div className="story-viewer-avatar">

                {viewingStory.user?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "U"}

              </div>

              <div>

                <strong>
                  {viewingStory.user?.name ||
                    "Vynzo User"}
                </strong>

                <span>
                  @
                  {viewingStory.user?.username ||
                    "user"}
                </span>

              </div>

            </div>

            <div className="story-viewer-media">

              {viewingStory.mediaType ===
              "image" ? (

                <img
                  src={getMediaUrl(
                    viewingStory.media
                  )}
                  alt="Story"
                />

              ) : (

                <video
                  src={getMediaUrl(
                    viewingStory.media
                  )}
                  autoPlay
                  controls
                  playsInline
                />

              )}

            </div>

            {viewingStory.caption && (

              <p className="story-viewer-caption">
                {viewingStory.caption}
              </p>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default Home;
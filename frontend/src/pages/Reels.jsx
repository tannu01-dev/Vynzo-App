import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/reels.css";

function Reels() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [caption, setCaption] = useState("");

  const [recording, setRecording] = useState(false);

  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  // =====================================
// FETCH REELS
// =====================================

const fetchReels = async () => {
  try {
    setLoading(true);

    const res = await API.get("/posts");

    console.log("ALL POSTS:", res.data.posts);

    if (res.data.success) {
      const reelPosts = (res.data.posts || []).filter((post) => {
        // Reel agar postType se identify ho rahi hai
        if (post.postType === "reel") {
          return true;
        }

        // Fallback: video file extension se identify karo
        const media = post.media || "";

        return /\.(mp4|webm|mov|avi|mkv)$/i.test(media);
      });

      console.log("REELS FOUND:", reelPosts);

      setReels(reelPosts);
    }
  } catch (error) {
    console.log("FETCH REELS ERROR:", error);

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
    fetchReels();

    return () => {
      stopCamera();

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  // =====================================
  // FILE UPLOAD
  // =====================================

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file.");
      return;
    }

    setSelectedVideo(file);

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    setShowCreate(true);
  };

  // =====================================
  // OPEN CAMERA
  // =====================================

  const openCamera = async () => {
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

      streamRef.current = stream;

      setShowCreate(false);
      setShowCamera(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);

    } catch (error) {
      console.log("CAMERA ERROR:", error);

      if (error.name === "NotAllowedError") {
        alert(
          "Camera permission denied. Please allow camera access in your browser."
        );
      } else if (
        error.name === "NotFoundError"
      ) {
        alert(
          "No camera was found on this device."
        );
      } else {
        alert(
          "Unable to open camera."
        );
      }
    }
  };

  // =====================================
  // STOP CAMERA
  // =====================================

  const stopCamera = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setRecording(false);
    setRecordingTime(0);
  };

  // =====================================
  // START RECORDING
  // =====================================

  const startRecording = () => {
    if (!streamRef.current) {
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
        mimeType =
          "video/webm;codecs=vp9,opus";
      } else if (
        MediaRecorder.isTypeSupported(
          "video/webm"
        )
      ) {
        mimeType = "video/webm";
      }

      const recorder = mimeType
        ? new MediaRecorder(
            streamRef.current,
            { mimeType }
          )
        : new MediaRecorder(
            streamRef.current
          );

      const chunks = [];

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type:
            mimeType ||
            "video/webm",
        });

        const file = new File(
          [blob],
          `vynzo-reel-${Date.now()}.webm`,
          {
            type:
              mimeType ||
              "video/webm",
          }
        );

        setSelectedVideo(file);

        const url =
          URL.createObjectURL(blob);

        setPreviewUrl(url);

        stopCamera();

        setShowCamera(false);
        setShowCreate(true);
      };

      recorder.start();

      setRecording(true);
      setRecordingTime(0);

      timerRef.current =
        setInterval(() => {
          setRecordingTime(
            (previous) => previous + 1
          );
        }, 1000);

    } catch (error) {
      console.log(
        "RECORDING ERROR:",
        error
      );

      alert(
        "Unable to start recording."
      );
    }
  };

  // =====================================
  // STOP RECORDING
  // =====================================

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
        "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);

      timerRef.current = null;
    }

    setRecording(false);
  };

  // =====================================
  // FORMAT TIME
  // =====================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // =====================================
  // CLOSE CREATE
  // =====================================

  const closeCreate = () => {
    stopCamera();

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedVideo(null);
    setPreviewUrl("");
    setCaption("");

    setShowCreate(false);
    setShowCamera(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================
  // CREATE REEL
  // =====================================

  const handleCreateReel = async () => {
    if (!selectedVideo) {
      alert("Please select or record a video.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append(
        "media",
        selectedVideo
      );

      formData.append(
        "caption",
        caption
      );

      formData.append(
        "postType",
        "reel"
      );

      const res = await API.post(
        "/posts",
        formData
      );

      console.log(
        "CREATE REEL RESPONSE:",
        res.data
      );

      if (res.data.success) {
  console.log("NEW REEL:", res.data.post);

  setReels((previous) => [
    res.data.post,
    ...previous,
  ]);

  closeCreate();

  alert("Reel uploaded successfully 🎉");
}
    } catch (error) {
      console.log(
        "CREATE REEL ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to upload reel"
      );
    } finally {
      setUploading(false);
    }
  };

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
  // LIKE
  // =====================================

  const handleLike = async (postId) => {
    try {
      const res = await API.put(
        `/posts/${postId}/like`
      );

      if (res.data.success) {
        setReels((previous) =>
          previous.map((reel) =>
            reel._id === postId
              ? {
                  ...reel,
                  likes: Array(
                    res.data.likes
                  ).fill("like"),
                }
              : reel
          )
        );
      }
    } catch (error) {
      console.log(
        "REEL LIKE ERROR:",
        error
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
          title: "Vynzo Reel",
          text:
            "Check out this reel on Vynzo ✨",
          url: shareUrl,
        });
      } catch (error) {
        console.log(
          "Share cancelled"
        );
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          shareUrl
        );

        alert(
          "Reel link copied! 🔗"
        );
      } catch (error) {
        alert(
          "Unable to share reel."
        );
      }
    }
  };

  return (
    <div className="reels-page">

      {/* =================================
          HEADER
      ================================= */}

      <header className="reels-header">

        <div>
          <h1>Reels</h1>

          <p>
            Watch and share short videos
            on Vynzo
          </p>
        </div>

        <button
          className="create-reel-button"
          onClick={() =>
            setShowCreate(true)
          }
        >
          + Create Reel
        </button>

      </header>


      {/* =================================
          HIDDEN FILE INPUT
      ================================= */}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={handleFileSelect}
      />


      {/* =================================
          CREATE REEL MODAL
      ================================= */}

      {showCreate && (

        <div className="reel-modal-backdrop">

          <div className="reel-modal">

            {!selectedVideo ? (

              <>
                <div className="modal-top">

                  <div>
                    <h2>
                      Create a Reel
                    </h2>

                    <p>
                      Choose how you want
                      to create your reel
                    </p>
                  </div>

                  <button
                    className="close-button"
                    onClick={closeCreate}
                  >
                    ×
                  </button>

                </div>


                <div className="create-options">

                  {/* FILE */}

                  <button
                    className="create-option"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >

                    <div className="option-icon">
                      📁
                    </div>

                    <div>
                      <strong>
                        Upload from files
                      </strong>

                      <span>
                        Choose a video from
                        your device
                      </span>
                    </div>

                  </button>


                  {/* CAMERA */}

                  <button
                    className="create-option"
                    onClick={openCamera}
                  >

                    <div className="option-icon">
                      📷
                    </div>

                    <div>
                      <strong>
                        Camera
                      </strong>

                      <span>
                        Record a new reel
                      </span>
                    </div>

                  </button>

                </div>
              </>

            ) : (

              <>
                <div className="modal-top">

                  <div>
                    <h2>
                      New Reel
                    </h2>

                    <p>
                      Preview your reel
                    </p>
                  </div>

                  <button
                    className="close-button"
                    onClick={closeCreate}
                  >
                    ×
                  </button>

                </div>


                {/* PREVIEW */}

                <div className="reel-preview">

                  <video
                    src={previewUrl}
                    controls
                    autoPlay
                    muted
                    loop
                  />

                </div>


                {/* CAPTION */}

                <textarea
                  className="reel-caption-input"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) =>
                    setCaption(e.target.value)
                  }
                  maxLength={500}
                />


                <div className="upload-actions">

                  <button
                    className="cancel-reel"
                    onClick={closeCreate}
                    disabled={uploading}
                  >
                    Cancel
                  </button>

                  <button
                    className="post-reel"
                    onClick={handleCreateReel}
                    disabled={uploading}
                  >
                    {uploading
                      ? "Uploading..."
                      : "Post Reel"}
                  </button>

                </div>

              </>
            )}

          </div>

        </div>
      )}


      {/* =================================
          CAMERA
      ================================= */}

      {showCamera && (

        <div className="reel-modal-backdrop">

          <div className="camera-modal">

            <div className="camera-header">

              <div>
                <h2>
                  Create Reel
                </h2>

                <span>
                  {recording
                    ? formatTime(
                        recordingTime
                      )
                    : "Camera"}
                </span>
              </div>

              <button
                className="close-button"
                onClick={stopCamera}
              >
                ×
              </button>

            </div>


            <div className="camera-preview">

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
              />

              {recording && (
                <div className="recording-indicator">
                  <span className="record-dot">
                    ●
                  </span>

                  Recording{" "}
                  {formatTime(
                    recordingTime
                  )}
                </div>
              )}

            </div>


            <div className="camera-controls">

              {!recording ? (

                <button
                  className="record-button"
                  onClick={startRecording}
                >
                  <span>●</span>
                </button>

              ) : (

                <button
                  className="stop-record-button"
                  onClick={stopRecording}
                >
                  ■
                </button>

              )}

            </div>


            <p className="camera-hint">

              {recording
                ? "Tap the button to stop recording"
                : "Tap the button to start recording"}

            </p>

          </div>

        </div>
      )}


      {/* =================================
          LOADING
      ================================= */}

      {loading && (

        <div className="reels-message">

          <div className="reels-loader"></div>

          <p>
            Loading reels...
          </p>

        </div>
      )}


      {/* =================================
          NO REELS
      ================================= */}

      {!loading &&
        reels.length === 0 && (

          <div className="reels-message">

            <div className="reels-empty-icon">
              🎬
            </div>

            <h2>
              No reels yet
            </h2>

            <p>
              Be the first to create
              a reel on Vynzo.
            </p>

            <button
              className="empty-create-button"
              onClick={() =>
                setShowCreate(true)
              }
            >
              + Create your first Reel
            </button>

          </div>
        )}


      {/* =================================
          REELS
      ================================= */}

      {!loading &&
        reels.length > 0 && (

          <div className="reels-container">

            {reels.map((reel) => (

              <article
                className="reel-card"
                key={reel._id}
              >

                <video
                  className="reel-video"
                  src={getMediaUrl(
                    reel.media
                  )}
                  controls
                  loop
                  playsInline
                  preload="metadata"
                />


                <div className="reel-overlay">

                  <div className="reel-user">

                    <div className="reel-avatar">

                      {reel.user?.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}

                    </div>

                    <div>

                      <strong>
                        {reel.user?.name ||
                          "Vynzo User"}
                      </strong>

                      <span>
                        @
                        {reel.user?.username ||
                          "user"}
                      </span>

                    </div>

                  </div>


                  {reel.caption && (

                    <p className="reel-caption">
                      {reel.caption}
                    </p>

                  )}


                  <div className="reel-actions">

                    <button
                      onClick={() =>
                        handleLike(
                          reel._id
                        )
                      }
                    >
                      ❤️
                      <span>
                        {reel.likes?.length ||
                          0}
                      </span>
                    </button>


                    <button>
                      💬
                      <span>
                        {reel.comments?.length ||
                          0}
                      </span>
                    </button>


                    <button
                      onClick={() =>
                        handleShare(
                          reel._id
                        )
                      }
                    >
                      ↗
                      <span>
                        Share
                      </span>
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>
        )}

    </div>
  );
}

export default Reels;
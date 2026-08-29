const fs = require("fs");
const path = require("path");

const Post = require("../models/Post");

// =====================================
// CREATE POST / REEL
// =====================================


// const createPost = async (req, res) => {
//   try {
//     const { caption, postType } = req.body;

//     console.log("BODY:", req.body);
//     console.log("FILE MIME:", req.file?.mimetype);
//     console.log("FILE NAME:", req.file?.originalname);

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Photo or video is required",
//       });
//     }

//     // File extension se bhi check karenge
//     const fileName = req.file.originalname || "";
//     const mimeType = req.file.mimetype || "";

//     const isVideo =
//       mimeType.startsWith("video/") ||
//       /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(fileName);

//     const mediaType = isVideo ? "video" : "image";

//     // Reel sirf video honi chahiye
//     const finalPostType =
//       postType === "reel" && isVideo
//         ? "reel"
//         : "post";

//     const post = await Post.create({
//       user: req.user._id,
//       caption: caption || "",
//       media: `/uploads/${req.file.filename}`,
//       mediaType,
//       postType: finalPostType,
//     });

//     const populatedPost =
//       await Post.findById(post._id)
//         .populate("user", "name username")
//         .populate("comments.user", "name username");

//     res.status(201).json({
//       success: true,
//       message:
//         finalPostType === "reel"
//           ? "Reel created successfully"
//           : "Post created successfully",
//       post: populatedPost,
//     });

//   } catch (error) {
//     console.log("CREATE POST ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to create post",
//     });
//   }
// };

// =====================================
// CREATE POST / REEL / STORY
// =====================================

const createPost = async (req, res) => {
  try {
    const { caption, postType } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE MIME:", req.file?.mimetype);
    console.log("FILE NAME:", req.file?.originalname);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo or video is required",
      });
    }

    const fileName = req.file.originalname || "";
    const mimeType = req.file.mimetype || "";

    const isVideo =
      mimeType.startsWith("video/") ||
      /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(fileName);

    const mediaType = isVideo ? "video" : "image";

    // =====================================
    // POST TYPE DECISION
    // =====================================

    let finalPostType = "post";

    // STORY
    if (postType === "story") {
      finalPostType = "story";
    }

    // REEL = only video
    else if (postType === "reel") {
      if (!isVideo) {
        return res.status(400).json({
          success: false,
          message: "Reel must be a video",
        });
      }

      finalPostType = "reel";
    }

    // NORMAL POST
    else {
      finalPostType = "post";
    }

    // =====================================
    // CREATE
    // =====================================

    const post = await Post.create({
      user: req.user._id,
      caption: caption || "",
      media: `/uploads/${req.file.filename}`,
      mediaType,
      postType: finalPostType,
    });

    // =====================================
    // POPULATE
    // =====================================

    const populatedPost = await Post.findById(post._id)
      .populate("user", "name username")
      .populate("comments.user", "name username");

    // =====================================
    // RESPONSE
    // =====================================

    res.status(201).json({
      success: true,

      message:
        finalPostType === "story"
          ? "Story created successfully"
          : finalPostType === "reel"
          ? "Reel created successfully"
          : "Post created successfully",

      post: populatedPost,
    });

  } catch (error) {
    console.log("CREATE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

// =====================================
// GET ALL POSTS
// =====================================

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name username")
      .populate("comments.user", "name username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });

  } catch (error) {
    console.log("GET POSTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};


// =====================================
// LIKE / UNLIKE
// =====================================

const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likes: post.likes.length,
    });

  } catch (error) {
    console.log("LIKE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to like post",
    });
  }
};


// =====================================
// ADD COMMENT
// =====================================

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user._id,
      text: text.trim(),
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "name username")
      .populate("comments.user", "name username");

    res.status(201).json({
      success: true,
      message: "Comment added",
      post: updatedPost,
    });

  } catch (error) {
    console.log("COMMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};
// =====================================
// DELETE POST / REEL / STORY
// =====================================

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Post nahi mili
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Sirf owner delete kar sakta hai
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own post",
      });
    }

    // Database se post delete
    await Post.findByIdAndDelete(req.params.id);

    // Uploaded media file bhi delete karne ki koshish
    if (post.media) {
      const filePath = path.join(
        __dirname,
        "..",
        post.media.replace(/^\/+/, "")
      );

      fs.unlink(filePath, (error) => {
        if (error) {
          console.log("MEDIA DELETE ERROR:", error.message);
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("DELETE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};


module.exports = {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  deletePost
};
const express = require("express");
const multer = require("multer");

const {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  deletePost
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ================================
// MULTER STORAGE
// ================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },
});


const upload = multer({
  storage,

  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});


// CREATE POST
router.post(
  "/",
  protect,
  upload.single("media"),
  createPost
);


// GET POSTS
router.get(
  "/",
  protect,
  getPosts
);
router.put(
  "/:id/like",
  protect,
  toggleLike
);
router.post(
  "/:id/comment",
  protect,
  addComment
);

// DELETE POST
router.delete(
  "/:id",
  protect,
  deletePost
);

module.exports = router;
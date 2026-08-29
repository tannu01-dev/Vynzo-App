const express = require("express");
const multer = require("multer");

const {
  createStory,
  getStories,
} = require("../controllers/storyController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// MULTER STORAGE
// =====================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },
});


const upload = multer({
  storage,

  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});


// =====================================
// CREATE STORY
// =====================================

router.post(
  "/",
  protect,
  upload.single("media"),
  createStory
);


// =====================================
// GET STORIES
// =====================================

router.get(
  "/",
  protect,
  getStories
);


module.exports = router;
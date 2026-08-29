const Story = require("../models/Story");

// =====================================
// CREATE STORY
// =====================================

const createStory = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo or video is required",
      });
    }

    const mediaType = req.file.mimetype.startsWith("video")
      ? "video"
      : "image";

    const story = await Story.create({
      user: req.user._id,

      media: `/uploads/${req.file.filename}`,

      mediaType,

      caption: caption || "",

      // Story expires after 24 hours
      expiresAt: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ),
    });

    const populatedStory = await Story.findById(story._id)
      .populate("user", "name username profilePicture");

    res.status(201).json({
      success: true,
      message: "Story created successfully",
      story: populatedStory,
    });

  } catch (error) {
    console.log("CREATE STORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create story",
    });
  }
};


// =====================================
// GET ACTIVE STORIES
// =====================================

const getStories = async (req, res) => {
  try {
    const stories = await Story.find({
      expiresAt: {
        $gt: new Date(),
      },
    })
      .populate("user", "name username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      stories,
    });

  } catch (error) {
    console.log("GET STORIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stories",
    });
  }
};


module.exports = {
  createStory,
  getStories,
};
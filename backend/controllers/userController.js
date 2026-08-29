const User = require("../models/User");


// =====================================
// GET PROFILE
// =====================================

const getProfile = async (req, res) => {
  try {

    res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {

    console.error("PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};


// =====================================
// FOLLOW / UNFOLLOW USER
// =====================================

const toggleFollow = async (req, res) => {
  try {

    const targetUserId = req.params.id;
    const currentUserId = req.user._id;


    // Khud ko follow nahi kar sakte
    if (targetUserId === currentUserId.toString()) {

      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });

    }


    // Jisko follow karna hai
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }


    // Current logged-in user
    const currentUser = await User.findById(
      currentUserId
    );


    // Already following?
    const alreadyFollowing =
      currentUser.following.some(
        (id) =>
          id.toString() === targetUserId
      );


    if (alreadyFollowing) {

      // ==========================
      // UNFOLLOW
      // ==========================

      currentUser.following =
        currentUser.following.filter(
          (id) =>
            id.toString() !== targetUserId
        );


      targetUser.followers =
        targetUser.followers.filter(
          (id) =>
            id.toString() !==
            currentUserId.toString()
        );

    } else {

      // ==========================
      // FOLLOW
      // ==========================

      currentUser.following.push(
        targetUserId
      );

      targetUser.followers.push(
        currentUserId
      );

    }


    await currentUser.save();
    await targetUser.save();


    res.status(200).json({

      success: true,

      following: !alreadyFollowing,

      followers:
        targetUser.followers.length,

      followingCount:
        currentUser.following.length,

    });


  } catch (error) {

    console.error(
      "FOLLOW ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to follow user",
    });

  }
};
// =====================================
// GET SUGGESTED USERS
// =====================================

const getSuggestions = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Current user ko chhodkar users find karo
    const users = await User.find({
      _id: { $ne: currentUserId },
    })
      .select("name username profilePicture bio followers following")
      .limit(10);

    // Har user ke liye check karo ki current user
    // usko already follow kar raha hai ya nahi
    const suggestions = users.map((user) => {
      const isFollowing = user.followers.some(
        (followerId) =>
          followerId.toString() ===
          currentUserId.toString()
      );

      return {
        _id: user._id,
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing,
      };
    });

    res.status(200).json({
      success: true,
      users: suggestions,
    });

  } catch (error) {
    console.error("SUGGESTIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch suggested users",
    });
  }
};




// =====================================
// EXPORT
// =====================================

module.exports = {
  getProfile,
  toggleFollow,
  getSuggestions
};
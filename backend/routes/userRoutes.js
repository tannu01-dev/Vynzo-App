const express = require("express");
const router = express.Router();

const { getProfile,toggleFollow,getSuggestions } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.get("/profile", protect, getProfile);

router.get("/suggestions", protect, getSuggestions);



router.put(
  "/:id/follow",
  protect,
  toggleFollow
);


module.exports = router;
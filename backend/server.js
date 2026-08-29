const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const storyRoutes = require("./routes/storyRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/api/posts", postRoutes);
app.use("/api/stories", storyRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Vynzo API is running 🚀"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Vynzo server running on port ${PORT}`);
});
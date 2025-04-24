const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const errorMiddleware = require("./middleware/errorMiddleware");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const likeRoutes = require("./routes/likeRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request body
app.use(morgan("dev")); // HTTP request logger

// Static files - for production deployment
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/users", userRoutes);

// Default API route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Blog Platform API" });
});

// Serve frontend in production
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;

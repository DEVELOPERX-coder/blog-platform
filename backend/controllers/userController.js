const User = require("../models/User");
const Blog = require("../models/Blog");
const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Get user details
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's blogs with pagination
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const blogs = await Blog.findByUserId(userId, limit, offset);

    res.json({
      user: {
        userId: user.user_id,
        username: user.username,
        bio: user.bio,
        profileImage: user.profile_image,
        createdAt: user.created_at,
      },
      blogs,
    });
  } catch (error) {
    logger.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error retrieving user profile" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { bio, profile_image } = req.body;

    await User.updateProfile(userId, { bio, profile_image });

    res.json({
      message: "Profile updated successfully",
      profile: {
        bio,
        profileImage: profile_image,
      },
    });
  } catch (error) {
    logger.error("Update profile error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Get current user's blog posts
exports.getUserBlogs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const blogs = await Blog.findByUserId(userId, limit, offset);

    res.json({ blogs });
  } catch (error) {
    logger.error("Get user blogs error:", error);
    res.status(500).json({ message: "Server error retrieving user blogs" });
  }
};

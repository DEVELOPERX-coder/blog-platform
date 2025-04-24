const express = require("express");
const likeController = require("../controllers/likeController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// All like routes require authentication
router.use(authenticate);

// Like a blog
router.post("/blogs/:blogId", likeController.likeBlog);

// Unlike a blog
router.delete("/blogs/:blogId", likeController.unlikeBlog);

// Get like status for current user and a blog
router.get("/status/blogs/:blogId", likeController.getLikeStatus);

// Get all users who liked a blog
router.get("/blogs/:blogId", likeController.getBlogLikes);

module.exports = router;

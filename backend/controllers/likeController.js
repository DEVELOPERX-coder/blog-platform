const Like = require("../models/Like");
const Blog = require("../models/Blog");

// Like a blog post
exports.likeBlog = async (req, res) => {
  try {
    const blogId = parseInt(req.params.blogId);
    const userId = req.user.userId;

    // First check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Add like
    const result = await Like.create(userId, blogId);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    // Get updated like count
    const likeCount = await Like.countByBlogId(blogId);

    res.status(201).json({
      message: "Blog liked successfully",
      likeCount,
    });
  } catch (error) {
    console.error("Like blog error:", error);
    res.status(500).json({ message: "Server error liking blog" });
  }
};

// Unlike a blog post
exports.unlikeBlog = async (req, res) => {
  try {
    const blogId = parseInt(req.params.blogId);
    const userId = req.user.userId;

    // Remove like
    const result = await Like.delete(userId, blogId);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    // Get updated like count
    const likeCount = await Like.countByBlogId(blogId);

    res.json({
      message: "Blog unliked successfully",
      likeCount,
    });
  } catch (error) {
    console.error("Unlike blog error:", error);
    res.status(500).json({ message: "Server error unliking blog" });
  }
};

// Get like status for current user and a blog
exports.getLikeStatus = async (req, res) => {
  try {
    const blogId = parseInt(req.params.blogId);
    const userId = req.user.userId;

    const isLiked = await Like.checkLiked(userId, blogId);
    const likeCount = await Like.countByBlogId(blogId);

    res.json({
      isLiked,
      likeCount,
    });
  } catch (error) {
    console.error("Get like status error:", error);
    res.status(500).json({ message: "Server error getting like status" });
  }
};

// Get all users who liked a blog
exports.getBlogLikes = async (req, res) => {
  try {
    const blogId = parseInt(req.params.blogId);

    // First check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const likes = await Like.getLikesByBlogId(blogId);

    res.json({ likes });
  } catch (error) {
    console.error("Get blog likes error:", error);
    res.status(500).json({ message: "Server error retrieving likes" });
  }
};

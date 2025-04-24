const Blog = require("../models/Blog");
const { validationResult } = require("express-validator");

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const userId = req.user.userId;

    const blogId = await Blog.create({
      user_id: userId,
      title,
      content,
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog: {
        blogId,
        title,
        content,
        userId,
      },
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ message: "Server error creating blog" });
  }
};

// Get all blog posts with pagination
exports.getAllBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const blogs = await Blog.findAll(limit, offset);

    res.json({ blogs });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({ message: "Server error retrieving blogs" });
  }
};

// Get a single blog post by ID
exports.getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ blog });
  } catch (error) {
    console.error("Get blog error:", error);
    res.status(500).json({ message: "Server error retrieving blog" });
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blogId = req.params.id;
    const userId = req.user.userId;
    const { title, content } = req.body;

    const result = await Blog.update(blogId, userId, { title, content });

    if (!result.success) {
      return res
        .status(result.message === "Unauthorized" ? 403 : 404)
        .json({ message: result.message });
    }

    res.json({
      message: "Blog updated successfully",
      blog: {
        blogId,
        title,
        content,
      },
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Server error updating blog" });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.userId;

    const result = await Blog.delete(blogId, userId);

    if (!result.success) {
      return res
        .status(result.message === "Unauthorized" ? 403 : 404)
        .json({ message: result.message });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Server error deleting blog" });
  }
};

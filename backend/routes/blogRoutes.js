const express = require("express");
const { body } = require("express-validator");
const blogController = require("../controllers/blogController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// All blog routes require authentication
router.use(authenticate);

// Create blog route with validation
router.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 5, max: 255 })
      .withMessage("Title must be between 5 and 255 characters"),
    body("content").trim().notEmpty().withMessage("Content cannot be empty"),
  ],
  blogController.createBlog
);

// Get all blogs
router.get("/", blogController.getAllBlogs);

// Get blog by ID
router.get("/:id", blogController.getBlogById);

// Update blog route with validation
router.put(
  "/:id",
  [
    body("title")
      .trim()
      .isLength({ min: 5, max: 255 })
      .withMessage("Title must be between 5 and 255 characters"),
    body("content").trim().notEmpty().withMessage("Content cannot be empty"),
  ],
  blogController.updateBlog
);

// Delete blog
router.delete("/:id", blogController.deleteBlog);

module.exports = router;

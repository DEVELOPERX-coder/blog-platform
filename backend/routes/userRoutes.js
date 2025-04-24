const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");

const router = express.Router();

// Get user profile by ID (public)
router.get("/:id", userController.getUserProfile);

// Update profile (protected)
router.put(
  "/profile",
  authenticate,
  [
    body("bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio must not exceed 500 characters"),
    body("profile_image")
      .optional()
      .isURL()
      .withMessage("Profile image must be a valid URL"),
  ],
  validateRequest,
  userController.updateProfile
);

// Get current user's blog posts (protected)
router.get("/me/blogs", authenticate, userController.getUserBlogs);

module.exports = router;

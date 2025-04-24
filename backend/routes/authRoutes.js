const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Register route with validation
router.post(
  "/register",
  [
    body("username").isLength({ min: 3, max: 50 }).trim(),
    body("email").isEmail().normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  authController.register
);

// Login route with validation
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  authController.login
);

// Get current user profile
router.get("/me", authenticate, authController.getMe);

module.exports = router;

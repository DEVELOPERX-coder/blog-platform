const { body, param, query } = require("express-validator");

// User validation rules
const userValidationRules = {
  register: [
    body("username")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("Username must be between 3 and 50 characters")
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage(
        "Username can only contain letters, numbers, underscores and hyphens"
      ),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number"),
  ],

  login: [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required"),
  ],

  updateProfile: [
    body("bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio must not exceed 500 characters"),

    body("profile_image")
      .optional()
      .isURL()
      .withMessage("Profile image must be a valid URL"),
  ],
};

// Blog validation rules
const blogValidationRules = {
  create: [
    body("title")
      .trim()
      .isLength({ min: 5, max: 255 })
      .withMessage("Title must be between 5 and 255 characters"),

    body("content").trim().notEmpty().withMessage("Content is required"),
  ],

  update: [
    body("title")
      .trim()
      .isLength({ min: 5, max: 255 })
      .withMessage("Title must be between 5 and 255 characters"),

    body("content").trim().notEmpty().withMessage("Content is required"),
  ],

  getBlog: [param("id").isInt().withMessage("Blog ID must be an integer")],

  getBlogs: [
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),

    query("offset")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Offset must be a positive integer"),
  ],
};

module.exports = {
  userValidationRules,
  blogValidationRules,
};

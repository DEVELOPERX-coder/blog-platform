const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

// Middleware to check for validation errors
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.debug("Validation errors:", errors.array());
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

// Custom middleware for validating specific entities
exports.validateBlogOwnership = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.userId;

    // This is just a placeholder. In the real implementation,
    // you would check if the blog belongs to the user.
    // This functionality is already implemented in the Blog model

    next();
  } catch (error) {
    logger.error("Blog ownership validation error:", error);
    res.status(500).json({ message: "Server error during validation" });
  }
};

// Sanitize user input
exports.sanitizeUserInput = (req, res, next) => {
  // This is a simple example. In a real implementation,
  // you would sanitize user input to prevent XSS attacks.
  // Express-validator already has sanitization features built-in

  // For the blog content, you might want to use a library like DOMPurify
  if (req.body.content) {
    // req.body.content = sanitizeHtml(req.body.content);
  }

  next();
};

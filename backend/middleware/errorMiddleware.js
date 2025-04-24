const logger = require("../utils/logger");
const config = require("../config/config");

const errorMiddleware = (err, req, res, next) => {
  // Log error details
  logger.error("Error:", err);

  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server";

  // Customize error response based on type
  let response = {
    message,
    status,
  };

  // Add stack trace in development mode
  if (config.server.env === "development") {
    response.stack = err.stack;
  }

  // Add request details for debugging
  if (config.server.env === "development") {
    response.request = {
      method: req.method,
      path: req.path,
      query: req.query,
      body:
        req.method === "POST" || req.method === "PUT" ? req.body : undefined,
    };
  }

  // Handle specific types of errors
  if (err.name === "ValidationError") {
    response.status = 400;
    response.details = err.details || [];
  } else if (
    err.name === "UnauthorizedError" ||
    err.name === "JsonWebTokenError"
  ) {
    response.status = 401;
  } else if (err.name === "ForbiddenError") {
    response.status = 403;
  } else if (err.name === "NotFoundError") {
    response.status = 404;
  } else if (err.code === "ER_DUP_ENTRY") {
    response.status = 409;
    response.message = "Duplicate entry found";
  }

  res.status(response.status).json(response);
};

module.exports = errorMiddleware;

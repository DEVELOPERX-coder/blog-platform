const config = require("../config/config");

// Simple logging utility
const logger = {
  debug: function (message, ...args) {
    if (config.logging.level === "debug") {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },

  info: function (message, ...args) {
    console.log(`[INFO] ${message}`, ...args);
  },

  warn: function (message, ...args) {
    console.warn(`[WARNING] ${message}`, ...args);
  },

  error: function (message, ...args) {
    console.error(`[ERROR] ${message}`, ...args);
  },

  request: function (req, res, next) {
    const start = Date.now();

    // Log on response finish
    res.on("finish", () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get("user-agent") || "-",
        ip: req.ip || req.connection.remoteAddress,
      };

      // Log in appropriate format
      if (res.statusCode >= 400) {
        this.error(
          `HTTP ${logData.method} ${logData.url} ${logData.status} ${logData.duration}`
        );
      } else {
        this.info(
          `HTTP ${logData.method} ${logData.url} ${logData.status} ${logData.duration}`
        );
      }
    });

    next();
  },
};

module.exports = logger;

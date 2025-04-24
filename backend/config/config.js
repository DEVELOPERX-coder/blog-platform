require("dotenv").config();

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },

  // Authentication configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: "24h",
    saltRounds: 10, // For bcrypt
  },

  // Logging configuration
  logging: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: process.env.NODE_ENV === "production" ? "combined" : "dev",
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
};

module.exports = config;

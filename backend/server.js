const app = require("./app");
const { testConnection } = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Test database connection before starting server
async function startServer() {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

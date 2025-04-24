const { pool } = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async create(userData) {
    const { username, email, password } = userData;

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    try {
      const [result] = await pool.execute(query, [
        username,
        email,
        hashedPassword,
      ]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";

    try {
      const [rows] = await pool.execute(query, [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(userId) {
    const query =
      "SELECT user_id, username, email, bio, profile_image, created_at FROM users WHERE user_id = ?";

    try {
      const [rows] = await pool.execute(query, [userId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, profileData) {
    const { bio, profile_image } = profileData;
    const query =
      "UPDATE users SET bio = ?, profile_image = ? WHERE user_id = ?";

    try {
      await pool.execute(query, [bio, profile_image, userId]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;

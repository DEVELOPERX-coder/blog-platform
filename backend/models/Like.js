const { pool } = require("../config/database");

class Like {
  static async create(userId, blogId) {
    const query = "INSERT INTO likes (user_id, blog_id) VALUES (?, ?)";

    try {
      const [result] = await pool.execute(query, [userId, blogId]);
      return { success: true, likeId: result.insertId };
    } catch (error) {
      // Handle duplicate like
      if (error.code === "ER_DUP_ENTRY") {
        return { success: false, message: "Blog already liked" };
      }
      throw error;
    }
  }

  static async delete(userId, blogId) {
    const query = "DELETE FROM likes WHERE user_id = ? AND blog_id = ?";

    try {
      const [result] = await pool.execute(query, [userId, blogId]);

      if (result.affectedRows === 0) {
        return { success: false, message: "Like not found" };
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  static async checkLiked(userId, blogId) {
    const query = "SELECT * FROM likes WHERE user_id = ? AND blog_id = ?";

    try {
      const [rows] = await pool.execute(query, [userId, blogId]);
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  static async countByBlogId(blogId) {
    const query = "SELECT COUNT(*) as count FROM likes WHERE blog_id = ?";

    try {
      const [rows] = await pool.execute(query, [blogId]);
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }

  static async getLikesByBlogId(blogId) {
    const query = `
      SELECT l.*, u.username 
      FROM likes l
      JOIN users u ON l.user_id = u.user_id
      WHERE l.blog_id = ?
      ORDER BY l.created_at DESC
    `;

    try {
      const [rows] = await pool.execute(query, [blogId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Like;

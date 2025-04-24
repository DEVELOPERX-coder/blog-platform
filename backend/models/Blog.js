const { pool } = require("../config/database");

class Blog {
  static async create(blogData) {
    const { user_id, title, content } = blogData;

    const query =
      "INSERT INTO blogs (user_id, title, content) VALUES (?, ?, ?)";

    try {
      const [result] = await pool.execute(query, [user_id, title, content]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findById(blogId) {
    const query = `
      SELECT b.*, u.username, 
        (SELECT COUNT(*) FROM likes WHERE blog_id = b.blog_id) as like_count
      FROM blogs b
      JOIN users u ON b.user_id = u.user_id
      WHERE b.blog_id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [blogId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll(limit = 10, offset = 0) {
    const query = `
      SELECT b.*, u.username, 
        (SELECT COUNT(*) FROM likes WHERE blog_id = b.blog_id) as like_count
      FROM blogs b
      JOIN users u ON b.user_id = u.user_id
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await pool.execute(query, [limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId, limit = 10, offset = 0) {
    const query = `
      SELECT b.*, 
        (SELECT COUNT(*) FROM likes WHERE blog_id = b.blog_id) as like_count
      FROM blogs b
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await pool.execute(query, [userId, limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(blogId, userId, blogData) {
    const { title, content } = blogData;

    // First verify the blog belongs to this user
    const verifyQuery = "SELECT user_id FROM blogs WHERE blog_id = ?";

    try {
      const [rows] = await pool.execute(verifyQuery, [blogId]);

      if (rows.length === 0) {
        return { success: false, message: "Blog not found" };
      }

      if (rows[0].user_id !== userId) {
        return { success: false, message: "Unauthorized" };
      }

      // Proceed with update
      const updateQuery =
        "UPDATE blogs SET title = ?, content = ? WHERE blog_id = ?";
      await pool.execute(updateQuery, [title, content, blogId]);

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  static async delete(blogId, userId) {
    // First verify the blog belongs to this user
    const verifyQuery = "SELECT user_id FROM blogs WHERE blog_id = ?";

    try {
      const [rows] = await pool.execute(verifyQuery, [blogId]);

      if (rows.length === 0) {
        return { success: false, message: "Blog not found" };
      }

      if (rows[0].user_id !== userId) {
        return { success: false, message: "Unauthorized" };
      }

      // Proceed with delete
      const deleteQuery = "DELETE FROM blogs WHERE blog_id = ?";
      await pool.execute(deleteQuery, [blogId]);

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Blog;

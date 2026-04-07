const pool = require('../config/db');

class UserModel {
  static async create(username, password, email, role = 'user') {
    try {
      console.log('Attempting to create user:', username, email, role);
      const [result] = await pool.execute(
        'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
        [username, password, email, role]
      );
      console.log('User created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async updateScore(userId, score) {
    const [result] = await pool.execute(
      'UPDATE users SET total_score = total_score + ? WHERE id = ?',
      [score, userId]
    );
    return result;
  }

  static async getAllUsers() {
    const [rows] = await pool.execute('SELECT id, username, email, role, total_score, created_at FROM users ORDER BY total_score DESC');
    return rows;
  }

  static async updateRole(userId, role) {
    const [result] = await pool.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, userId]
    );
    return result;
  }
}

module.exports = UserModel;
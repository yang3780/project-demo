const pool = require('../config/db');

class UserQuestionScoreModel {
  static async create(userId, questionId, scoreEarned) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO user_question_scores (user_id, question_id, score_earned) VALUES (?, ?, ?)',
        [userId, questionId, scoreEarned]
      );
      return result;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return null;
      }
      throw error;
    }
  }

  static async findByUserIdAndQuestionId(userId, questionId) {
    const [rows] = await pool.execute(
      'SELECT * FROM user_question_scores WHERE user_id = ? AND question_id = ?',
      [userId, questionId]
    );
    return rows[0];
  }

  static async getSolvedQuestionsByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT q.*, uqs.score_earned, uqs.solved_at FROM user_question_scores uqs JOIN questions q ON uqs.question_id = q.id WHERE uqs.user_id = ? ORDER BY uqs.solved_at DESC',
      [userId]
    );
    return rows;
  }

  static async getUsersSolvedQuestionCount(userId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM user_question_scores WHERE user_id = ?',
      [userId]
    );
    return rows[0].count;
  }

  static async getTotalScoreByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT SUM(score_earned) as total FROM user_question_scores WHERE user_id = ?',
      [userId]
    );
    return rows[0].total || 0;
  }
}

module.exports = UserQuestionScoreModel;
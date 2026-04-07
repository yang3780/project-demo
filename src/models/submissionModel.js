const pool = require('../config/db');

class SubmissionModel {
  static async create(userId, questionId, code, language) {
    const [result] = await pool.execute(
      'INSERT INTO submissions (user_id, question_id, code, language, status) VALUES (?, ?, ?, ?, ?)',
      [userId, questionId, code, language, 'PENDING']
    );
    return result;
  }

  static async updateStatus(id, status, execTime, memoryUsed, judgedAt, message = null) {
    try {
      // 首先尝试带message字段的更新
      const [result] = await pool.execute(
        'UPDATE submissions SET status = ?, exec_time = ?, memory_used = ?, judged_at = ?, message = ? WHERE id = ?',
        [status, execTime, memoryUsed, judgedAt, message, id]
      );
      return result;
    } catch (error) {
      // 如果失败，可能是没有message字段，降级到不带message的更新
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        console.log('[Model] message column not found, falling back');
        const [result] = await pool.execute(
          'UPDATE submissions SET status = ?, exec_time = ?, memory_used = ?, judged_at = ? WHERE id = ?',
          [status, execTime, memoryUsed, judgedAt, id]
        );
        return result;
      }
      throw error;
    }
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM submissions WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async getSubmissionsByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT s.*, q.title FROM submissions s JOIN questions q ON s.question_id = q.id WHERE s.user_id = ? ORDER BY s.submitted_at DESC',
      [userId]
    );
    return rows;
  }

  static async getSubmissionsByQuestionId(questionId) {
    const [rows] = await pool.execute(
      'SELECT s.*, u.username FROM submissions s JOIN users u ON s.user_id = u.id WHERE s.question_id = ? ORDER BY s.submitted_at DESC',
      [questionId]
    );
    return rows;
  }

  static async getSubmissionsByUserIdAndQuestionId(userId, questionId) {
    const [rows] = await pool.execute(
      'SELECT * FROM submissions WHERE user_id = ? AND question_id = ? ORDER BY submitted_at DESC',
      [userId, questionId]
    );
    return rows;
  }

  static async getLatestSubmission(userId, questionId) {
    const [rows] = await pool.execute(
      'SELECT * FROM submissions WHERE user_id = ? AND question_id = ? ORDER BY submitted_at DESC LIMIT 1',
      [userId, questionId]
    );
    return rows[0];
  }

  static async getWeeklySubmissionCount(userId) {
    // 生成过去7天的日期
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    // 查询每天的提交数量
    const [rows] = await pool.execute(
      `SELECT DATE(submitted_at) as date, COUNT(*) as count 
       FROM submissions 
       WHERE user_id = ? AND submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(submitted_at)
       ORDER BY date ASC`,
      [userId]
    );
    
    // 将查询结果转换为按天分组的对象
    const submissionMap = {};
    rows.forEach(row => {
      submissionMap[row.date] = row.count;
    });
    
    // 确保每天都有数据，没有提交的天计数为0
    const result = days.map(day => ({
      date: day,
      count: submissionMap[day] || 0
    }));
    
    return result;
  }
}

module.exports = SubmissionModel;
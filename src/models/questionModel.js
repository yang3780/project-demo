const pool = require('../config/db');

class QuestionModel {
  static async create(title, description, inputFormat, outputFormat, sampleInput, sampleOutput, difficulty, score, type, timeLimit, memoryLimit) {
    const [result] = await pool.execute(
      'INSERT INTO questions (title, description, input_format, output_format, sample_input, sample_output, difficulty, score, type, time_limit, memory_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, inputFormat, outputFormat, sampleInput, sampleOutput, difficulty, score, type, timeLimit, memoryLimit]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM questions WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async getAllQuestions() {
    const [rows] = await pool.execute('SELECT * FROM questions');
    return rows;
  }

  static async getQuestionsByDifficulty(difficulty) {
    const [rows] = await pool.execute(
      'SELECT * FROM questions WHERE difficulty = ?',
      [difficulty]
    );
    return rows;
  }

  static async getQuestionsByType(type) {
    const [rows] = await pool.execute(
      'SELECT * FROM questions WHERE type = ?',
      [type]
    );
    return rows;
  }

  static async getQuestionsByDifficultyAndType(difficulty, type) {
    const [rows] = await pool.execute(
      'SELECT * FROM questions WHERE difficulty = ? AND type = ?',
      [difficulty, type]
    );
    return rows;
  }

  static async update(id, title, description, inputFormat, outputFormat, sampleInput, sampleOutput, difficulty, score, type, timeLimit, memoryLimit) {
    const [result] = await pool.execute(
      'UPDATE questions SET title = ?, description = ?, input_format = ?, output_format = ?, sample_input = ?, sample_output = ?, difficulty = ?, score = ?, type = ?, time_limit = ?, memory_limit = ? WHERE id = ?',
      [title, description, inputFormat, outputFormat, sampleInput, sampleOutput, difficulty, score, type, timeLimit, memoryLimit, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM questions WHERE id = ?',
      [id]
    );
    return result;
  }
}

module.exports = QuestionModel;
const QuestionModel = require('../models/questionModel');

class QuestionController {
  static async getQuestions(req, res) {
    try {
      const { id, difficulty, type } = req.query;
      let questions;

      if (id) {
        // 按ID搜索
        const question = await QuestionModel.findById(id);
        questions = question ? [question] : [];
      } else if (difficulty && type) {
        questions = await QuestionModel.getQuestionsByDifficultyAndType(difficulty, type);
      } else if (difficulty) {
        questions = await QuestionModel.getQuestionsByDifficulty(difficulty);
      } else if (type) {
        questions = await QuestionModel.getQuestionsByType(type);
      } else {
        questions = await QuestionModel.getAllQuestions();
      }

      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getQuestionById(req, res) {
    try {
      const { id } = req.params;
      const question = await QuestionModel.findById(id);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createQuestion(req, res) {
    try {
      const { title, description, input_format, output_format, sample_input, sample_output, difficulty, score, type, time_limit, memory_limit } = req.body;
      await QuestionModel.create(title, description, input_format, output_format, sample_input, sample_output, difficulty, score, type, time_limit, memory_limit);
      res.status(201).json({ message: 'Question created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateQuestion(req, res) {
    try {
      const { id } = req.params;
      const { title, description, input_format, output_format, sample_input, sample_output, difficulty, score, type, time_limit, memory_limit } = req.body;
      await QuestionModel.update(id, title, description, input_format, output_format, sample_input, sample_output, difficulty, score, type, time_limit, memory_limit);
      res.json({ message: 'Question updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteQuestion(req, res) {
    try {
      const { id } = req.params;
      await QuestionModel.delete(id);
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = QuestionController;
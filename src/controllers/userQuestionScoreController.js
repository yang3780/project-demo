const UserQuestionScoreModel = require('../models/userQuestionScoreModel');

class UserQuestionScoreController {
  static async getSolvedQuestions(req, res) {
    try {
      const user_id = req.user.id;
      const solvedQuestions = await UserQuestionScoreModel.getSolvedQuestionsByUserId(user_id);
      res.json(solvedQuestions);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getSolvedQuestionCount(req, res) {
    try {
      const user_id = req.user.id;
      const count = await UserQuestionScoreModel.getUsersSolvedQuestionCount(user_id);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getTotalScore(req, res) {
    try {
      const user_id = req.user.id;
      const totalScore = await UserQuestionScoreModel.getTotalScoreByUserId(user_id);
      res.json({ total_score: totalScore });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserQuestionScoreController;
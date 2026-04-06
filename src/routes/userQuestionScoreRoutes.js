const express = require('express');
const UserQuestionScoreController = require('../controllers/userQuestionScoreController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/solved', auth, UserQuestionScoreController.getSolvedQuestions);
router.get('/solved/count', auth, UserQuestionScoreController.getSolvedQuestionCount);
router.get('/total-score', auth, UserQuestionScoreController.getTotalScore);

module.exports = router;
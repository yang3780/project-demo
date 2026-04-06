const express = require('express');
const QuestionController = require('../controllers/questionController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/', QuestionController.getQuestions);
router.get('/:id', QuestionController.getQuestionById);
router.post('/', adminAuth, QuestionController.createQuestion);
router.put('/:id', adminAuth, QuestionController.updateQuestion);
router.delete('/:id', adminAuth, QuestionController.deleteQuestion);

module.exports = router;
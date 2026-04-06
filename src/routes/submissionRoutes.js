const express = require('express');
const SubmissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, SubmissionController.submitCode);
router.get('/:id', auth, SubmissionController.getSubmissionStatus);
router.get('/user/all', auth, SubmissionController.getUserSubmissions);
router.get('/question/:question_id', auth, SubmissionController.getQuestionSubmissions);
router.get('/user/:question_id', auth, SubmissionController.getUserQuestionSubmissions);
router.get('/user/weekly/count', auth, SubmissionController.getWeeklySubmissionCount);

module.exports = router;
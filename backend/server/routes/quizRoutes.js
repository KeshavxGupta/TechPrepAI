const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  saveQuiz,
  deleteQuiz,
  submitQuizResult,
  getStudentResults,
  getAllResults
} = require('../controllers/quizController');

router.get('/', getQuizzes);
router.post('/', saveQuiz);
router.get('/results', getAllResults);
router.post('/results', submitQuizResult);
router.get('/results/user/:email', getStudentResults);
router.get('/:id', getQuizById);
router.delete('/:id', deleteQuiz);

module.exports = router;

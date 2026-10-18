const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblemById,
  runCode,
  submitSolution,
  getUserSubmissions
} = require('../controllers/dsaController');

router.get('/problems', getProblems);
router.get('/problems/:problemId', getProblemById);
router.post('/run', runCode);
router.post('/submit', submitSolution);
router.get('/submissions/user/:email', getUserSubmissions);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getUserResumes,
  getResumeById,
  saveResume,
  scanAts,
  deleteResume
} = require('../controllers/resumeController');

router.post('/', saveResume);
router.post('/scan-ats', scanAts);
router.get('/user/:email', getUserResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getPlacements,
  getUserPlacements,
  createPlacement,
  updatePlacement,
  updatePlacementStatus,
  deletePlacement,
  syncUserPlacements
} = require('../controllers/placementController');

router.get('/', getPlacements);
router.post('/', createPlacement);
router.post('/sync', syncUserPlacements);
router.get('/user/:email', getUserPlacements);
router.put('/:id', updatePlacement);
router.patch('/:id/status', updatePlacementStatus);
router.delete('/:id', deletePlacement);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getTelemetry } = require('../controllers/adminController');

router.get('/telemetry', getTelemetry);

module.exports = router;

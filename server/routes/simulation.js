const express = require('express');
const router = express.Router();
const {
  startSimulation,
  stopSimulation,
  getStatus,
  updateSettings,
  resetSimulation
} = require('../controllers/simulationController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(protect);

router.get('/status', getStatus);
router.post('/start', isAdmin, startSimulation);
router.post('/stop', isAdmin, stopSimulation);
router.put('/settings', isAdmin, updateSettings);
router.post('/reset', isAdmin, resetSimulation);

module.exports = router;

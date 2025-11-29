const express = require('express');
const router = express.Router();
const {
  getSummary,
  getByType,
  getBySeverity,
  getByIP,
  getTimeline,
  getByProtocol
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.get('/summary', getSummary);
router.get('/by-type', getByType);
router.get('/by-severity', getBySeverity);
router.get('/by-ip', getByIP);
router.get('/timeline', getTimeline);
router.get('/by-protocol', getByProtocol);

module.exports = router;

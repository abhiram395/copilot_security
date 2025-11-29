const express = require('express');
const router = express.Router();
const {
  getLogs,
  getLogById,
  deleteLog,
  clearAllLogs,
  exportLogs
} = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(protect);

router.get('/', getLogs);
router.get('/export', exportLogs);
router.get('/:id', getLogById);
router.delete('/:id', isAdmin, deleteLog);
router.delete('/', isAdmin, clearAllLogs);

module.exports = router;

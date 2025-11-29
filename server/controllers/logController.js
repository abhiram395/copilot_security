const AttackLog = require('../models/AttackLog');

// @desc    Get all logs with pagination and filters
// @route   GET /api/logs
// @access  Private
const getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    if (req.query.ip) {
      filter.ip = { $regex: req.query.ip, $options: 'i' };
    }
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    if (req.query.severity) {
      filter.severity = req.query.severity;
    }
    
    if (req.query.protocol) {
      filter.protocol = req.query.protocol;
    }
    
    if (req.query.startDate || req.query.endDate) {
      filter.timestamp = {};
      if (req.query.startDate) {
        filter.timestamp.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.timestamp.$lte = new Date(req.query.endDate);
      }
    }
    
    // Sort order
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const [logs, total] = await Promise.all([
      AttackLog.find(filter)
        .sort({ timestamp: sortOrder })
        .skip(skip)
        .limit(limit),
      AttackLog.countDocuments(filter)
    ]);
    
    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single log
// @route   GET /api/logs/:id
// @access  Private
const getLogById = async (req, res) => {
  try {
    const log = await AttackLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete single log (admin only)
// @route   DELETE /api/logs/:id
// @access  Private/Admin
const deleteLog = async (req, res) => {
  try {
    const log = await AttackLog.findByIdAndDelete(req.params.id);
    
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Clear all logs (admin only)
// @route   DELETE /api/logs
// @access  Private/Admin
const clearAllLogs = async (req, res) => {
  try {
    await AttackLog.deleteMany({});
    res.json({ message: 'All logs cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Export logs to CSV
// @route   GET /api/logs/export
// @access  Private
const exportLogs = async (req, res) => {
  try {
    // Build filter (same as getLogs)
    const filter = {};
    
    if (req.query.ip) filter.ip = { $regex: req.query.ip, $options: 'i' };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.severity) filter.severity = req.query.severity;
    if (req.query.startDate || req.query.endDate) {
      filter.timestamp = {};
      if (req.query.startDate) filter.timestamp.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.timestamp.$lte = new Date(req.query.endDate);
    }
    
    const logs = await AttackLog.find(filter).sort({ timestamp: -1 }).limit(10000);
    
    // Create CSV
    const headers = ['ID', 'Type', 'IP', 'Protocol', 'Severity', 'Timestamp', 'Description', 'Target Port', 'Payload'];
    const csvRows = [headers.join(',')];
    
    for (const log of logs) {
      const row = [
        log._id,
        `"${log.type}"`,
        log.ip,
        log.protocol,
        log.severity,
        log.timestamp.toISOString(),
        `"${log.description.replace(/"/g, '""')}"`,
        log.targetPort || '',
        log.payload ? `"${log.payload.replace(/"/g, '""')}"` : ''
      ];
      csvRows.push(row.join(','));
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attack_logs.csv');
    res.send(csvRows.join('\n'));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getLogs,
  getLogById,
  deleteLog,
  clearAllLogs,
  exportLogs
};

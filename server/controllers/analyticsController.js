const AttackLog = require('../models/AttackLog');

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const [total, bySeverity, byType] = await Promise.all([
      AttackLog.countDocuments(),
      AttackLog.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),
      AttackLog.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    ]);
    
    res.json({
      totalAttacks: total,
      bySeverity: bySeverity.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byType: byType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get attacks by type
// @route   GET /api/analytics/by-type
// @access  Private
const getByType = async (req, res) => {
  try {
    const result = await AttackLog.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json(result.map(item => ({
      type: item._id,
      count: item.count
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get attacks by severity
// @route   GET /api/analytics/by-severity
// @access  Private
const getBySeverity = async (req, res) => {
  try {
    const result = await AttackLog.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    // Ensure all severities are represented
    const severities = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    result.forEach(item => {
      severities[item._id] = item.count;
    });
    
    res.json(Object.entries(severities).map(([severity, count]) => ({
      severity,
      count
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get most targeted IPs
// @route   GET /api/analytics/by-ip
// @access  Private
const getByIP = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await AttackLog.aggregate([
      { $group: { _id: '$ip', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);
    
    res.json(result.map(item => ({
      ip: item._id,
      count: item.count
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get attacks timeline
// @route   GET /api/analytics/timeline
// @access  Private
const getTimeline = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 1;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    // Group by minute
    const result = await AttackLog.aggregate([
      { $match: { timestamp: { $gte: startTime } } },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
            hour: { $hour: '$timestamp' },
            minute: { $minute: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1, '_id.minute': 1 } }
    ]);
    
    res.json(result.map(item => ({
      timestamp: new Date(
        item._id.year,
        item._id.month - 1,
        item._id.day,
        item._id.hour,
        item._id.minute
      ),
      count: item.count
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get protocol usage
// @route   GET /api/analytics/by-protocol
// @access  Private
const getByProtocol = async (req, res) => {
  try {
    const result = await AttackLog.aggregate([
      { $group: { _id: '$protocol', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json(result.map(item => ({
      protocol: item._id,
      count: item.count
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSummary,
  getByType,
  getBySeverity,
  getByIP,
  getTimeline,
  getByProtocol
};

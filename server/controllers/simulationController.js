const simulationEngine = require('../simulation/simulationEngine');
const AttackLog = require('../models/AttackLog');

// @desc    Start simulation
// @route   POST /api/simulation/start
// @access  Private/Admin
const startSimulation = async (req, res) => {
  try {
    const result = await simulationEngine.start();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to start simulation', error: error.message });
  }
};

// @desc    Stop simulation
// @route   POST /api/simulation/stop
// @access  Private/Admin
const stopSimulation = async (req, res) => {
  try {
    const result = simulationEngine.stop();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to stop simulation', error: error.message });
  }
};

// @desc    Get simulation status
// @route   GET /api/simulation/status
// @access  Private
const getStatus = async (req, res) => {
  try {
    const status = simulationEngine.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get status', error: error.message });
  }
};

// @desc    Update simulation settings
// @route   PUT /api/simulation/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const { intensity, enabledAttackTypes } = req.body;
    const status = simulationEngine.updateSettings({ intensity, enabledAttackTypes });
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};

// @desc    Reset simulation and clear all data
// @route   POST /api/simulation/reset
// @access  Private/Admin
const resetSimulation = async (req, res) => {
  try {
    // Stop simulation first
    simulationEngine.stop();
    
    // Clear all logs
    await AttackLog.deleteMany({});
    
    // Reset stats
    simulationEngine.resetStats();
    
    res.json({ message: 'Simulation reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset simulation', error: error.message });
  }
};

module.exports = {
  startSimulation,
  stopSimulation,
  getStatus,
  updateSettings,
  resetSimulation
};

const { generateAttackLog, getAttackTypeNames } = require('./attackGenerator');
const AttackLog = require('../models/AttackLog');

class SimulationEngine {
  constructor() {
    this.isRunning = false;
    this.intensity = 'medium'; // low, medium, high, extreme
    this.enabledAttackTypes = getAttackTypeNames();
    this.interval = null;
    this.io = null;
    this.stats = {
      totalAttacks: 0,
      attacksPerMinute: 0,
      attacksByType: {},
      attacksBySeverity: { Low: 0, Medium: 0, High: 0, Critical: 0 }
    };
    this.recentLogs = [];
    this.attacksLastMinute = [];
  }

  // Set Socket.io instance
  setSocketIO(io) {
    this.io = io;
  }

  // Get interval based on intensity
  getInterval() {
    const intervals = {
      low: 2000,      // 1 log per 2 seconds
      medium: 1000,   // 1 log per second
      high: 200,      // 5 logs per second
      extreme: 50     // 20 logs per second
    };
    return intervals[this.intensity] || 1000;
  }

  // Private method to generate and emit a single log
  async _generateAndEmitLog() {
    if (!this.isRunning) return;
    
    const log = generateAttackLog(this.enabledAttackTypes);
    
    try {
      // Save to database
      const savedLog = await AttackLog.create(log);
      
      // Update stats
      this.updateStats(savedLog);
      
      // Add to recent logs (keep last 50)
      this.recentLogs.unshift(savedLog);
      if (this.recentLogs.length > 50) this.recentLogs.pop();
      
      // Emit to all connected clients
      if (this.io) {
        this.io.emit('log:new', savedLog);
        this.io.emit('simulation:stats', this.getStats());
      }
    } catch (error) {
      console.error('Error generating log:', error);
    }
  }

  // Start simulation
  async start() {
    if (this.isRunning) return { success: false, message: 'Simulation already running' };
    
    this.isRunning = true;
    this.emitStatus();

    // Start generating logs
    this.interval = setInterval(() => this._generateAndEmitLog(), this.getInterval());
    
    // Generate first log immediately
    await this._generateAndEmitLog();
    
    return { success: true, message: 'Simulation started' };
  }

  // Stop simulation
  stop() {
    if (!this.isRunning) return { success: false, message: 'Simulation not running' };
    
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    this.emitStatus();
    return { success: true, message: 'Simulation stopped' };
  }

  // Update statistics
  updateStats(log) {
    this.stats.totalAttacks++;
    
    // Update by type
    if (!this.stats.attacksByType[log.type]) {
      this.stats.attacksByType[log.type] = 0;
    }
    this.stats.attacksByType[log.type]++;
    
    // Update by severity
    this.stats.attacksBySeverity[log.severity]++;
    
    // Track attacks in last minute
    const now = Date.now();
    this.attacksLastMinute.push(now);
    this.attacksLastMinute = this.attacksLastMinute.filter(t => now - t < 60000);
    this.stats.attacksPerMinute = this.attacksLastMinute.length;
  }

  // Get current stats
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      intensity: this.intensity,
      enabledAttackTypes: this.enabledAttackTypes
    };
  }

  // Get status
  getStatus() {
    return {
      isRunning: this.isRunning,
      intensity: this.intensity,
      enabledAttackTypes: this.enabledAttackTypes,
      stats: this.stats
    };
  }

  // Update settings
  updateSettings({ intensity, enabledAttackTypes }) {
    if (intensity && ['low', 'medium', 'high', 'extreme'].includes(intensity)) {
      this.intensity = intensity;
      
      // Restart with new interval if running
      if (this.isRunning && this.interval) {
        clearInterval(this.interval);
        this.interval = setInterval(() => this._generateAndEmitLog(), this.getInterval());
      }
    }
    
    if (enabledAttackTypes && Array.isArray(enabledAttackTypes)) {
      this.enabledAttackTypes = enabledAttackTypes;
    }
    
    this.emitStatus();
    return this.getStatus();
  }

  // Emit status to all clients
  emitStatus() {
    if (this.io) {
      this.io.emit('simulation:status', this.getStatus());
    }
  }

  // Get recent logs
  getRecentLogs() {
    return this.recentLogs;
  }

  // Reset stats
  resetStats() {
    this.stats = {
      totalAttacks: 0,
      attacksPerMinute: 0,
      attacksByType: {},
      attacksBySeverity: { Low: 0, Medium: 0, High: 0, Critical: 0 }
    };
    this.recentLogs = [];
    this.attacksLastMinute = [];
    this.emitStatus();
  }
}

// Singleton instance
const simulationEngine = new SimulationEngine();

module.exports = simulationEngine;

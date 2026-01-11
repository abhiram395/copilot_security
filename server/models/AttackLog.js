const mongoose = require('mongoose');

const attackLogSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'Port Scan',
      'DDoS Spike',
      'Bruteforce Login',
      'SQL Injection Attempt',
      'Malware File Modification',
      'Unauthorized Access Attempt',
      'Ransomware Encryption Attempt',
      'XSS Attack',
      'Man-in-the-Middle Attack',
      'Phishing Attempt'
    ]
  },
  ip: {
    type: String,
    required: true
  },
  protocol: {
    type: String,
    required: true,
    enum: ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS']
  },
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  targetPort: {
    type: Number
  },
  payload: {
    type: String
  }
});

// Create indexes for efficient querying
attackLogSchema.index({ severity: 1 });
attackLogSchema.index({ ip: 1 });
attackLogSchema.index({ type: 1 });
attackLogSchema.index({ timestamp: -1, severity: 1 });

module.exports = mongoose.model('AttackLog', attackLogSchema);

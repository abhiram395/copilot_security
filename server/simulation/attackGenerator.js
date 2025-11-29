const { generateIP } = require('./ipGenerator');

// Attack types configuration
const attackTypes = [
  {
    type: 'Port Scan',
    protocols: ['TCP', 'UDP'],
    severityWeights: { Low: 0.5, Medium: 0.4, High: 0.1, Critical: 0 },
    descriptions: [
      'Sequential port scanning detected from {ip}',
      'SYN scan attempt on multiple ports from {ip}',
      'Stealth port scan activity detected from {ip}',
      'UDP port sweep detected from {ip}'
    ],
    ports: [22, 23, 25, 80, 443, 3306, 3389, 5432, 8080]
  },
  {
    type: 'DDoS Spike',
    protocols: ['TCP', 'UDP', 'ICMP'],
    severityWeights: { Low: 0, Medium: 0.1, High: 0.5, Critical: 0.4 },
    descriptions: [
      'High volume traffic spike from {ip}',
      'SYN flood attack detected from {ip}',
      'UDP amplification attack from {ip}',
      'Application layer DDoS from {ip}'
    ],
    ports: [80, 443, 53]
  },
  {
    type: 'Bruteforce Login',
    protocols: ['HTTP', 'HTTPS'],
    severityWeights: { Low: 0.1, Medium: 0.4, High: 0.4, Critical: 0.1 },
    descriptions: [
      'Multiple failed login attempts from {ip}',
      'Password spraying attack from {ip}',
      'Credential stuffing attempt from {ip}',
      'Automated login attempts detected from {ip}'
    ],
    ports: [22, 3389, 80, 443]
  },
  {
    type: 'SQL Injection Attempt',
    protocols: ['HTTP', 'HTTPS'],
    severityWeights: { Low: 0, Medium: 0.3, High: 0.5, Critical: 0.2 },
    descriptions: [
      'SQL injection payload detected from {ip}',
      'Attempted database extraction from {ip}',
      'UNION-based SQL injection from {ip}',
      'Blind SQL injection attempt from {ip}'
    ],
    ports: [80, 443, 8080],
    payloads: ["' OR '1'='1", "'; DROP TABLE users;--", "UNION SELECT * FROM users"]
  },
  {
    type: 'Malware File Modification',
    protocols: ['TCP', 'HTTP'],
    severityWeights: { Low: 0, Medium: 0.2, High: 0.5, Critical: 0.3 },
    descriptions: [
      'Suspicious file modification detected',
      'Malware signature found in uploaded file',
      'Trojan dropper activity from {ip}',
      'File integrity violation detected'
    ],
    ports: [21, 22, 445]
  },
  {
    type: 'Unauthorized Access Attempt',
    protocols: ['TCP', 'HTTP', 'HTTPS'],
    severityWeights: { Low: 0.2, Medium: 0.4, High: 0.3, Critical: 0.1 },
    descriptions: [
      'Unauthorized access attempt from {ip}',
      'Privilege escalation attempt from {ip}',
      'Access control bypass from {ip}',
      'Unauthorized API access from {ip}'
    ],
    ports: [22, 80, 443, 3389]
  },
  {
    type: 'Ransomware Encryption Attempt',
    protocols: ['TCP'],
    severityWeights: { Low: 0, Medium: 0, High: 0.2, Critical: 0.8 },
    descriptions: [
      'Ransomware encryption activity detected',
      'Mass file encryption attempt',
      'Ransomware C2 communication from {ip}',
      'Crypto-locker behavior detected'
    ],
    ports: [445, 139]
  },
  {
    type: 'XSS Attack',
    protocols: ['HTTP', 'HTTPS'],
    severityWeights: { Low: 0.2, Medium: 0.5, High: 0.25, Critical: 0.05 },
    descriptions: [
      'Cross-site scripting attempt from {ip}',
      'Reflected XSS payload detected',
      'Stored XSS attempt from {ip}',
      'DOM-based XSS attack detected'
    ],
    ports: [80, 443],
    payloads: ["<script>alert('xss')</script>", "<img src=x onerror=alert(1)>"]
  },
  {
    type: 'Man-in-the-Middle Attack',
    protocols: ['TCP', 'HTTP'],
    severityWeights: { Low: 0, Medium: 0.2, High: 0.5, Critical: 0.3 },
    descriptions: [
      'ARP spoofing detected from {ip}',
      'SSL stripping attempt detected',
      'DNS spoofing activity from {ip}',
      'Session hijacking attempt from {ip}'
    ],
    ports: [80, 443, 53]
  },
  {
    type: 'Phishing Attempt',
    protocols: ['HTTP', 'HTTPS'],
    severityWeights: { Low: 0.1, Medium: 0.4, High: 0.4, Critical: 0.1 },
    descriptions: [
      'Phishing email detected from {ip}',
      'Credential harvesting page detected',
      'Spear phishing attempt from {ip}',
      'Phishing link click detected'
    ],
    ports: [25, 80, 443]
  }
];

// Get weighted random severity
const getWeightedSeverity = (weights) => {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const [severity, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (rand < cumulative) return severity;
  }
  return 'Medium';
};

// Generate a single attack log
const generateAttackLog = (enabledTypes = null) => {
  let availableTypes = attackTypes;
  
  if (enabledTypes && Array.isArray(enabledTypes) && enabledTypes.length > 0) {
    availableTypes = attackTypes.filter(at => enabledTypes.includes(at.type));
    if (availableTypes.length === 0) availableTypes = attackTypes;
  }
  
  const attackConfig = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  const ip = generateIP();
  const severity = getWeightedSeverity(attackConfig.severityWeights);
  const description = attackConfig.descriptions[Math.floor(Math.random() * attackConfig.descriptions.length)]
    .replace('{ip}', ip);
  
  const log = {
    type: attackConfig.type,
    ip,
    protocol: attackConfig.protocols[Math.floor(Math.random() * attackConfig.protocols.length)],
    severity,
    timestamp: new Date(),
    description,
    targetPort: attackConfig.ports[Math.floor(Math.random() * attackConfig.ports.length)]
  };
  
  if (attackConfig.payloads) {
    log.payload = attackConfig.payloads[Math.floor(Math.random() * attackConfig.payloads.length)];
  }
  
  return log;
};

// Get all attack type names
const getAttackTypeNames = () => attackTypes.map(at => at.type);

module.exports = { generateAttackLog, getAttackTypeNames, attackTypes };

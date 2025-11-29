// Generate random IP addresses
const generateIP = (type = 'random') => {
  const rand = (max) => Math.floor(Math.random() * max);
  
  switch (type) {
    case 'internal':
      // Internal IP ranges: 192.168.x.x or 10.x.x.x
      return Math.random() > 0.5
        ? `192.168.${rand(256)}.${rand(256)}`
        : `10.${rand(256)}.${rand(256)}.${rand(256)}`;
    
    case 'external':
      // External IPs (avoiding reserved ranges)
      const first = [rand(127) + 1, rand(126) + 128, rand(33) + 192][rand(3)];
      return `${first}.${rand(256)}.${rand(256)}.${rand(256)}`;
    
    case 'malicious':
      // Known "malicious" IP simulation ranges
      const maliciousRanges = [
        '185.220.', '45.95.', '91.109.', '141.98.', '194.76.',
        '178.128.', '104.248.', '167.71.', '159.89.', '206.189.'
      ];
      return maliciousRanges[rand(maliciousRanges.length)] + `${rand(256)}.${rand(256)}`;
    
    default:
      // Random type selection
      const types = ['internal', 'external', 'malicious'];
      return generateIP(types[rand(3)]);
  }
};

module.exports = { generateIP };

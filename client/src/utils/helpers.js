// Severity color utilities
export const getSeverityColor = (severity) => {
  const colors = {
    Critical: 'text-red-500',
    High: 'text-orange-500',
    Medium: 'text-yellow-500',
    Low: 'text-green-500'
  };
  return colors[severity] || 'text-gray-500';
};

export const getSeverityBgColor = (severity) => {
  const colors = {
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-400 border-green-500/30'
  };
  return colors[severity] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

// Format relative time
export const formatRelativeTime = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// Attack type colors for charts
export const attackTypeColors = {
  'Port Scan': '#3b82f6',
  'DDoS Spike': '#ef4444',
  'Bruteforce Login': '#f97316',
  'SQL Injection Attempt': '#8b5cf6',
  'Malware File Modification': '#ec4899',
  'Unauthorized Access Attempt': '#eab308',
  'Ransomware Encryption Attempt': '#dc2626',
  'XSS Attack': '#14b8a6',
  'Man-in-the-Middle Attack': '#6366f1',
  'Phishing Attempt': '#f59e0b'
};

// Severity colors for charts
export const severityColors = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e'
};

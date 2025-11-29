import { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useSocket } from '../hooks/useSocket';
import api from '../services/api';
import { getSeverityBgColor, formatDate } from '../utils/helpers';

const ATTACK_TYPES = [
  'Port Scan', 'DDoS Spike', 'Bruteforce Login', 'SQL Injection Attempt',
  'Malware File Modification', 'Unauthorized Access Attempt', 'Ransomware Encryption Attempt',
  'XSS Attack', 'Man-in-the-Middle Attack', 'Phishing Attempt'
];

const LogsPage = () => {
  useSocket();
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    ip: '',
    type: '',
    severity: '',
    startDate: '',
    endDate: ''
  });
  const [sortOrder, setSortOrder] = useState('desc');
  
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortOrder
      });
      
      if (filters.ip) params.append('ip', filters.ip);
      if (filters.type) params.append('type', filters.type);
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get(`/logs?${params}`);
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchLogs();
  }, [pagination.page, sortOrder]);
  
  const handleFilter = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLogs();
  };
  
  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.ip) params.append('ip', filters.ip);
      if (filters.type) params.append('type', filters.type);
      if (filters.severity) params.append('severity', filters.severity);
      
      const response = await api.get(`/logs/export?${params}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attack_logs.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };
  
  const resetFilters = () => {
    setFilters({ ip: '', type: '', severity: '', startDate: '', endDate: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  return (
    <MainLayout title="Attack Logs">
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4">
          <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Filter by IP..."
              value={filters.ip}
              onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
              className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {ATTACK_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Filter
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
            
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              📥 Export CSV
            </button>
          </form>
        </div>
        
        {/* Logs Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 bg-gray-700/50">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">IP</th>
                  <th className="p-4">Protocol</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Port</th>
                  <th className="p-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">No logs found</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                      <td className="p-4 text-gray-300 text-sm whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="p-4 text-white">{log.type}</td>
                      <td className="p-4 font-mono text-gray-300">{log.ip}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                          {log.protocol}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs border ${getSeverityBgColor(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{log.targetPort || '-'}</td>
                      <td className="p-4 text-gray-400 text-sm max-w-xs truncate">{log.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-400">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.pages}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LogsPage;

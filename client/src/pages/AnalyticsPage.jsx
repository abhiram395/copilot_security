import { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import TimelineChart from '../components/Charts/TimelineChart';
import SeverityPieChart from '../components/Charts/SeverityPieChart';
import AttackTypeChart from '../components/Charts/AttackTypeChart';
import { useSocket } from '../hooks/useSocket';
import api from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PROTOCOL_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];

const AnalyticsPage = () => {
  useSocket();
  
  const [summary, setSummary] = useState(null);
  const [byType, setByType] = useState([]);
  const [bySeverity, setBySeverity] = useState([]);
  const [byIP, setByIP] = useState([]);
  const [byProtocol, setByProtocol] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [timeRange, setTimeRange] = useState(1);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);
  
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryRes, typeRes, severityRes, ipRes, protocolRes, timelineRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/by-type'),
        api.get('/analytics/by-severity'),
        api.get('/analytics/by-ip?limit=10'),
        api.get('/analytics/by-protocol'),
        api.get(`/analytics/timeline?hours=${timeRange}`)
      ]);
      
      setSummary(summaryRes.data);
      setByType(typeRes.data);
      setBySeverity(severityRes.data);
      setByIP(ipRes.data);
      setByProtocol(protocolRes.data);
      setTimeline(timelineRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
    setLoading(false);
  };
  
  if (loading) {
    return (
      <MainLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Analytics">
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Time Range:</span>
          <div className="flex gap-2">
            {[1, 6, 12, 24].map((hours) => (
              <button
                key={hours}
                onClick={() => setTimeRange(hours)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === hours 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {hours === 1 ? '1 Hour' : `${hours} Hours`}
              </button>
            ))}
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors ml-auto"
          >
            🔄 Refresh
          </button>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm">Total Attacks</p>
            <p className="text-3xl font-bold text-white mt-2">
              {summary?.totalAttacks?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm">Critical Alerts</p>
            <p className="text-3xl font-bold text-red-400 mt-2">
              {summary?.bySeverity?.Critical || 0}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm">High Severity</p>
            <p className="text-3xl font-bold text-orange-400 mt-2">
              {summary?.bySeverity?.High || 0}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm">Attack Types</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">
              {Object.keys(summary?.byType || {}).length}
            </p>
          </div>
        </div>
        
        {/* Timeline */}
        <TimelineChart data={timeline} title={`Attack Timeline (Last ${timeRange} Hour${timeRange > 1 ? 's' : ''})`} />
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attack Types */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white text-lg font-semibold mb-4">Attacks by Type</h3>
            <div className="space-y-2">
              {byType.map((item, index) => (
                <div key={item.type} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-sm">{item.type}</span>
                      <span className="text-gray-400 text-sm">{item.count}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(item.count / (byType[0]?.count || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Severity Distribution */}
          <SeverityPieChart data={summary?.bySeverity || {}} />
        </div>
        
        {/* Protocol and IP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Protocol Distribution */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white text-lg font-semibold mb-4">Protocol Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byProtocol}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="count"
                    nameKey="protocol"
                    label={({ protocol, percent }) => `${protocol} ${(percent * 100).toFixed(0)}%`}
                  >
                    {byProtocol.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PROTOCOL_COLORS[index % PROTOCOL_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Most Targeted IPs */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white text-lg font-semibold mb-4">Most Targeted IPs</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-2">#</th>
                    <th className="pb-2">IP Address</th>
                    <th className="pb-2">Attacks</th>
                  </tr>
                </thead>
                <tbody>
                  {byIP.map((item, index) => (
                    <tr key={item.ip} className="border-b border-gray-700/50">
                      <td className="py-2 text-gray-500">{index + 1}</td>
                      <td className="py-2 font-mono text-gray-300">{item.ip}</td>
                      <td className="py-2 text-white">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;

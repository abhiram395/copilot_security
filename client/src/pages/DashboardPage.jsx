import { useEffect, useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import StatsPanel from '../components/Dashboard/StatsPanel';
import LiveLogFeed from '../components/LogViewer/LiveLogFeed';
import TimelineChart from '../components/Charts/TimelineChart';
import SeverityPieChart from '../components/Charts/SeverityPieChart';
import AttackTypeChart from '../components/Charts/AttackTypeChart';
import { useSocket } from '../hooks/useSocket';
import useSimulationStore from '../store/simulationStore';
import api from '../services/api';

const DashboardPage = () => {
  useSocket();
  const stats = useSimulationStore((state) => state.stats);
  const [timelineData, setTimelineData] = useState([]);
  
  // Fetch timeline data periodically
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await api.get('/analytics/timeline?hours=1');
        setTimelineData(response.data);
      } catch (error) {
        console.error('Failed to fetch timeline:', error);
      }
    };
    
    fetchTimeline();
    const interval = setInterval(fetchTimeline, 10000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <StatsPanel />
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TimelineChart data={timelineData} title="Attack Timeline (Last Hour)" />
          </div>
          <div>
            <SeverityPieChart data={stats.attacksBySeverity} />
          </div>
        </div>
        
        {/* Attack Types and Live Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttackTypeChart data={stats.attacksByType} />
          <LiveLogFeed />
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;

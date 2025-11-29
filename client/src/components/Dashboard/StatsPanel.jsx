import useSimulationStore from '../../store/simulationStore';

const StatCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30'
  };
  
  return (
    <div className={`rounded-lg p-4 border ${colorClasses[color]} bg-gray-800`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
};

const StatsPanel = () => {
  const stats = useSimulationStore((state) => state.stats);
  const isRunning = useSimulationStore((state) => state.isRunning);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Attacks" 
        value={stats.totalAttacks.toLocaleString()} 
        icon="🎯" 
        color="blue"
      />
      <StatCard 
        title="Attacks/Minute" 
        value={stats.attacksPerMinute} 
        icon={isRunning ? "🔴" : "⏸️"} 
        color={isRunning ? "green" : "blue"}
      />
      <StatCard 
        title="Critical Alerts" 
        value={stats.attacksBySeverity?.Critical || 0} 
        icon="🚨" 
        color="red"
      />
      <StatCard 
        title="High Severity" 
        value={stats.attacksBySeverity?.High || 0} 
        icon="⚠️" 
        color="orange"
      />
    </div>
  );
};

export default StatsPanel;

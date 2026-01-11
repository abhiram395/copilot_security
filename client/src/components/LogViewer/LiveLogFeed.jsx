import useLogStore from '../../store/logStore';
import { getSeverityBgColor, formatRelativeTime } from '../../utils/helpers';

const LiveLogFeed = () => {
  const recentLogs = useLogStore((state) => state.recentLogs);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Live Attack Feed</h3>
        <span className="flex items-center gap-2 text-sm text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Live
        </span>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {recentLogs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <p>No attack logs yet</p>
            <p className="text-sm mt-1">Start simulation to see live data</p>
          </div>
        ) : (
          recentLogs.map((log, index) => (
            <div 
              key={log._id || index}
              className={`p-3 rounded-lg border animate-fadeIn ${getSeverityBgColor(log.severity)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{log.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                      {log.protocol}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{log.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono text-gray-300">{log.ip}</p>
                  <p className="text-xs text-gray-500">{formatRelativeTime(log.timestamp)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveLogFeed;

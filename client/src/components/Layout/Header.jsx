import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useSimulationStore from '../../store/simulationStore';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const stats = useSimulationStore((state) => state.stats);
  const isRunning = useSimulationStore((state) => state.isRunning);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isRunning && (
              <span className="text-green-400">
                🔴 Live • {stats.attacksPerMinute} attacks/min
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Stats Summary */}
          <div className="hidden md:flex items-center gap-6 mr-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{stats.totalAttacks.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Total Attacks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{stats.attacksBySeverity?.Critical || 0}</p>
              <p className="text-xs text-gray-400">Critical</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{stats.attacksBySeverity?.High || 0}</p>
              <p className="text-xs text-gray-400">High</p>
            </div>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-3">
            <span className="text-gray-300 text-sm hidden sm:block">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

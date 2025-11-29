import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useSimulationStore from '../../store/simulationStore';

const Sidebar = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const connected = useSimulationStore((state) => state.connected);
  const isRunning = useSimulationStore((state) => state.isRunning);
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/logs', label: 'Attack Logs', icon: '📋' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
  ];
  
  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin Panel', icon: '⚙️' });
  }
  
  return (
    <aside className="w-64 bg-gray-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span>SOC Dashboard</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Cybersecurity Monitoring</p>
      </div>
      
      {/* Status Indicators */}
      <div className="p-4 border-b border-gray-700 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Connection:</span>
          <span className={`flex items-center gap-1 ${connected ? 'text-green-400' : 'text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse-glow' : 'bg-red-400'}`}></span>
            {connected ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Simulation:</span>
          <span className={`flex items-center gap-1 ${isRunning ? 'text-green-400' : 'text-gray-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></span>
            {isRunning ? 'Running' : 'Stopped'}
          </span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-gray-400 text-xs capitalize">{user?.role || 'analyst'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

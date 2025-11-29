import { useState } from 'react';
import api from '../../services/api';
import useSimulationStore from '../../store/simulationStore';

const ATTACK_TYPES = [
  'Port Scan',
  'DDoS Spike',
  'Bruteforce Login',
  'SQL Injection Attempt',
  'Malware File Modification',
  'Unauthorized Access Attempt',
  'Ransomware Encryption Attempt',
  'XSS Attack',
  'Man-in-the-Middle Attack',
  'Phishing Attempt'
];

const AdminControls = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const isRunning = useSimulationStore((state) => state.isRunning);
  const intensity = useSimulationStore((state) => state.intensity);
  const enabledAttackTypes = useSimulationStore((state) => state.enabledAttackTypes);
  const setRunning = useSimulationStore((state) => state.setRunning);
  
  const handleToggleSimulation = async () => {
    setLoading(true);
    try {
      if (isRunning) {
        await api.post('/simulation/stop');
        setRunning(false);
        setMessage({ type: 'success', text: 'Simulation stopped' });
      } else {
        await api.post('/simulation/start');
        setRunning(true);
        setMessage({ type: 'success', text: 'Simulation started' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to toggle simulation' });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleIntensityChange = async (newIntensity) => {
    try {
      await api.put('/simulation/settings', { intensity: newIntensity });
      setMessage({ type: 'success', text: `Intensity set to ${newIntensity}` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update intensity' });
    }
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleToggleAttackType = async (type) => {
    const newTypes = enabledAttackTypes.includes(type)
      ? enabledAttackTypes.filter(t => t !== type)
      : [...enabledAttackTypes, type];
    
    try {
      await api.put('/simulation/settings', { enabledAttackTypes: newTypes });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update attack types' });
    }
  };
  
  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all logs?')) return;
    
    setLoading(true);
    try {
      await api.delete('/logs');
      setMessage({ type: 'success', text: 'All logs cleared' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear logs' });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset the simulation and clear all data?')) return;
    
    setLoading(true);
    try {
      await api.post('/simulation/reset');
      setMessage({ type: 'success', text: 'Simulation reset complete' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset simulation' });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };
  
  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}
      
      {/* Simulation Control */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Simulation Control</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleSimulation}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:opacity-50`}
          >
            {loading ? 'Processing...' : isRunning ? '⏹️ Stop Simulation' : '▶️ Start Simulation'}
          </button>
          <span className={`px-3 py-1 rounded-full text-sm ${isRunning ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {isRunning ? 'Running' : 'Stopped'}
          </span>
        </div>
      </div>
      
      {/* Intensity Control */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Attack Intensity</h3>
        <div className="grid grid-cols-4 gap-2">
          {['low', 'medium', 'high', 'extreme'].map((level) => (
            <button
              key={level}
              onClick={() => handleIntensityChange(level)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                intensity === level 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-3">
          {intensity === 'low' && '1 log per 2 seconds'}
          {intensity === 'medium' && '1 log per second'}
          {intensity === 'high' && '5 logs per second'}
          {intensity === 'extreme' && '20+ logs per second'}
        </p>
      </div>
      
      {/* Attack Types Toggle */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Attack Types</h3>
        <div className="grid grid-cols-2 gap-2">
          {ATTACK_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={enabledAttackTypes.includes(type)}
                onChange={() => handleToggleAttackType(type)}
                className="w-4 h-4 rounded bg-gray-600 border-gray-500 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-300 text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Danger Zone */}
      <div className="bg-gray-800 rounded-lg p-6 border border-red-500/30">
        <h3 className="text-red-400 text-lg font-semibold mb-4">⚠️ Danger Zone</h3>
        <div className="flex gap-4">
          <button
            onClick={handleClearLogs}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            Clear All Logs
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            Full System Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminControls;

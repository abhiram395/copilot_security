import { useEffect, useRef } from 'react';
import socketService from '../services/socket';
import useSimulationStore from '../store/simulationStore';
import useLogStore from '../store/logStore';

export const useSocket = () => {
  const setStatus = useSimulationStore((state) => state.setStatus);
  const setStats = useSimulationStore((state) => state.setStats);
  const setConnected = useSimulationStore((state) => state.setConnected);
  const addLog = useLogStore((state) => state.addLog);
  const setRecentLogs = useLogStore((state) => state.setRecentLogs);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const socket = socketService.connect();
    
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleStatus = (status) => setStatus(status);
    const handleStats = (stats) => setStats(stats);
    const handleNewLog = (log) => addLog(log);
    const handleRecentLogs = (logs) => setRecentLogs(logs);
    
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('simulation:status', handleStatus);
    socket.on('simulation:stats', handleStats);
    socket.on('log:new', handleNewLog);
    socket.on('logs:recent', handleRecentLogs);
    
    // Initial status if already connected
    if (socket.connected) {
      setConnected(true);
    }
    
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('simulation:status', handleStatus);
      socket.off('simulation:stats', handleStats);
      socket.off('log:new', handleNewLog);
      socket.off('logs:recent', handleRecentLogs);
    };
  }, [setStatus, setStats, setConnected, addLog, setRecentLogs]);
  
  return socketService;
};

const simulationEngine = require('../simulation/simulationEngine');

const setupSocket = (io) => {
  // Set io instance in simulation engine
  simulationEngine.setSocketIO(io);

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Send current status on connection
    socket.emit('simulation:status', simulationEngine.getStatus());
    socket.emit('simulation:stats', simulationEngine.getStats());
    
    // Send recent logs to new clients
    const recentLogs = simulationEngine.getRecentLogs();
    if (recentLogs.length > 0) {
      socket.emit('logs:recent', recentLogs);
    }
    
    // Handle client requesting status
    socket.on('simulation:getStatus', () => {
      socket.emit('simulation:status', simulationEngine.getStatus());
    });
    
    // Handle client requesting stats
    socket.on('simulation:getStats', () => {
      socket.emit('simulation:stats', simulationEngine.getStats());
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;

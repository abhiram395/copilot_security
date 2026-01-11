import { create } from 'zustand';

const useSimulationStore = create((set) => ({
  isRunning: false,
  intensity: 'medium',
  enabledAttackTypes: [],
  stats: {
    totalAttacks: 0,
    attacksPerMinute: 0,
    attacksByType: {},
    attacksBySeverity: { Low: 0, Medium: 0, High: 0, Critical: 0 }
  },
  connected: false,

  setStatus: (status) => set({
    isRunning: status.isRunning,
    intensity: status.intensity,
    enabledAttackTypes: status.enabledAttackTypes,
    stats: status.stats || {
      totalAttacks: 0,
      attacksPerMinute: 0,
      attacksByType: {},
      attacksBySeverity: { Low: 0, Medium: 0, High: 0, Critical: 0 }
    }
  }),

  setStats: (stats) => set({ stats }),
  
  setConnected: (connected) => set({ connected }),
  
  setRunning: (isRunning) => set({ isRunning }),
  
  setIntensity: (intensity) => set({ intensity }),
  
  setEnabledAttackTypes: (types) => set({ enabledAttackTypes: types })
}));

export default useSimulationStore;

import { create } from 'zustand';

const useLogStore = create((set, get) => ({
  logs: [],
  recentLogs: [],
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  },
  filters: {
    ip: '',
    type: '',
    severity: '',
    startDate: '',
    endDate: ''
  },
  loading: false,

  setLogs: (logs) => set({ logs }),
  
  addLog: (log) => set((state) => ({
    recentLogs: [log, ...state.recentLogs].slice(0, 50)
  })),
  
  setRecentLogs: (logs) => set({ recentLogs: logs }),
  
  setPagination: (pagination) => set({ pagination }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  resetFilters: () => set({
    filters: {
      ip: '',
      type: '',
      severity: '',
      startDate: '',
      endDate: ''
    }
  }),
  
  setLoading: (loading) => set({ loading }),
  
  clearLogs: () => set({ logs: [], recentLogs: [] })
}));

export default useLogStore;

import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import { setOnUnauthorized } from './services/api';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LogsPage from './pages/LogsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuthStore();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Component to set up API unauthorized handler with React Router
const ApiUnauthorizedHandler = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  
  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
      navigate('/login');
    });
  }, [navigate, logout]);
  
  return null;
};

function App() {
  const { fetchUser, isAuthenticated, token } = useAuthStore();
  
  useEffect(() => {
    if (token && !isAuthenticated) {
      fetchUser();
    }
  }, [token, isAuthenticated, fetchUser]);
  
  return (
    <BrowserRouter>
      <ApiUnauthorizedHandler />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logs" 
          element={
            <ProtectedRoute>
              <LogsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

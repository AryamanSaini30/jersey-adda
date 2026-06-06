import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import BrandHeader from './components/BrandHeader';
import AdminDashboard from './pages/AdminDashboard';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';
import { verifyAdminToken } from './api/admin';

function App() {
  const [adminToken, setAdminToken] = useState(() => window.localStorage.getItem('jerseyAddaAdminToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (adminToken) {
      verifyAdminToken(adminToken)
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          setAdminToken('');
          window.localStorage.removeItem('jerseyAddaAdminToken');
        })
        .finally(() => setIsVerifying(false));
    } else {
      setIsVerifying(false);
    }
  }, [adminToken]);

  const handleLogin = (token) => {
    setAdminToken(token);
    setIsAuthenticated(true);
    window.localStorage.setItem('jerseyAddaAdminToken', token);
  };

  const handleLogout = () => {
    setAdminToken('');
    window.localStorage.removeItem('jerseyAddaAdminToken');
    setIsAuthenticated(false);
  };

  const openPublic = () => {
    window.location.href = import.meta.env.VITE_PUBLIC_APP_URL || 'http://127.0.0.1:5173';
  };

  if (isVerifying) {
    return null; // Or a loading spinner
  }

  return (
    <BrowserRouter>
      <BrandHeader onNavigatePublic={openPublic} />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLogin} />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <AdminDashboard adminToken={adminToken} onLogout={handleLogout} onOpenPublic={openPublic} /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <SettingsPage adminToken={adminToken} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

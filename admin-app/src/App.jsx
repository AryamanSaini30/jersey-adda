import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import BrandHeader from './components/BrandHeader';
import AdminDashboard from './pages/AdminDashboard';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';
import { verifyAdminPassword } from './api/admin';

function App() {
  const [adminPassword, setAdminPassword] = useState(() => window.localStorage.getItem('jerseyAddaAdminPassword') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (adminPassword) {
      verifyAdminPassword(adminPassword)
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          setAdminPassword('');
          window.localStorage.removeItem('jerseyAddaAdminPassword');
        })
        .finally(() => setIsVerifying(false));
    } else {
      setIsVerifying(false);
    }
  }, [adminPassword]);

  const handleLogin = (password) => {
    setAdminPassword(password);
    setIsAuthenticated(true);
    window.localStorage.setItem('jerseyAddaAdminPassword', password);
  };

  const handleLogout = () => {
    setAdminPassword('');
    window.localStorage.removeItem('jerseyAddaAdminPassword');
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
          element={isAuthenticated ? <AdminDashboard adminPassword={adminPassword} onLogout={handleLogout} onOpenPublic={openPublic} /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <SettingsPage adminPassword={adminPassword} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

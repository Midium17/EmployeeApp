import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // FIX: this will be called after login saves to localStorage
  const handleLogin = () => {
    setToken(localStorage.getItem("token"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Dashboard Route */}
        <Route 
          path="/" 
          element={
            token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />
          } 
        />

        {/* Login Route */}
        <Route 
          path="/login" 
          element={
            !token ? <Login onLogin={handleLogin} setToken={setToken} /> : <Navigate to="/" replace />
          } 
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AssinarContrato from './pages/AssinarContrato';
import SuccessAvulso from './pages/SuccessAvulso';
import SuccessPremium from './pages/SuccessPremium';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Profile />} />
        
        <Route path="/success-avulso" element={<SuccessAvulso />} />
        <Route path="/success-premium" element={<SuccessPremium />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/assinar/:id" element={<AssinarContrato />} />
        
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
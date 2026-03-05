import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PensionProvider, usePension } from './context/PensionContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Invest from './pages/Invest';
import Admin from './pages/Admin';
import Loans from './pages/Loans';
import Policies from './pages/Policies';
import AI from './pages/AI';
import Settings from './pages/Settings';
import LanguageSelection from './pages/LanguageSelection';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = usePension();
  const { language } = useLanguage();
  
  if (!language) return <Navigate to="/language" />;
  if (!user) return <Navigate to="/auth" />;
  
  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  const { language } = useLanguage();

  return (
    <Routes>
      <Route path="/language" element={<LanguageSelection />} />
      <Route 
        path="/auth" 
        element={
          !language ? <Navigate to="/language" /> : <Auth />
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/invest" 
        element={
          <ProtectedRoute>
            <Invest />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/loans" 
        element={
          <ProtectedRoute>
            <Loans />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/policies" 
        element={
          <ProtectedRoute>
            <Policies />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ai" 
        element={
          <ProtectedRoute>
            <AI />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PensionProvider>
          <Router>
            <AppRoutes />
          </Router>
        </PensionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

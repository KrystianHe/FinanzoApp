import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Statistics from './pages/Statistics';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';

// Komponent do sprawdzania, czy użytkownik jest zalogowany
const RequireAuth = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Strona powitalna */}
        <Route path="/" element={<Welcome />} />
        
        {/* Publiczne ścieżki */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Zabezpieczone ścieżki */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <Layout>
              <Dashboard />
            </Layout>
          </RequireAuth>
        } />
        
        <Route path="/transactions" element={
          <RequireAuth>
            <Layout>
              <Transactions />
            </Layout>
          </RequireAuth>
        } />
        
        <Route path="/transactions/add" element={
          <RequireAuth>
            <Layout>
              <AddTransaction />
            </Layout>
          </RequireAuth>
        } />
        
        <Route path="/statistics" element={
          <RequireAuth>
            <Layout>
              <Statistics />
            </Layout>
          </RequireAuth>
        } />
        
        {/* Przekierowanie w przypadku nieprawidłowej ścieżki */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Predict from './pages/Predict';
import Analytics from './pages/Analytics';
import AdminPanel from './pages/AdminPanel';
import Subjects from './pages/Subjects';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, profile, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  // If user exists but profile check isn't complete (role is required for admin routes)
  if (adminOnly && !profile) {
    if (loading) {
       return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
        </div>
      );
    }
    // If loading is done but no profile, and it's an admin only route, redirect
    return <Navigate to="/dashboard" />;
  }
  
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/dashboard" />;
  
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/predict" element={
            <ProtectedRoute>
              <Predict />
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path="/subjects" element={
            <ProtectedRoute adminOnly>
              <Subjects />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


// ============================================================
//  ProtectedRoute.js
//  Path: client/src/components/ProtectedRoute.js
//  No style changes needed — this is a logic-only component.
//  Already uses your PageLoader correctly.
// ============================================================

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './Loader';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
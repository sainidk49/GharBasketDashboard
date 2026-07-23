import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles, requiredPermissions = [] }) => {
  const { isAuthenticated, user, role, requirePasswordChange, checkPermission, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requirePasswordChange && location.pathname !== '/force-change-password') {
    return <Navigate to="/force-change-password" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their respective dashboard if they try to access wrong role path
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'seller') return <Navigate to="/seller" replace />;
    if (role === 'delivery_partner') return <Navigate to="/delivery" replace />;
    return <Navigate to="/login" replace />;
  }

  if (requiredPermissions.length > 0) {
    const hasAllReqPerms = requiredPermissions.every((perm) => checkPermission(perm));
    if (!hasAllReqPerms) {
      return <div className="p-8 text-center text-error">Access Denied: Insufficient Permissions</div>;
    }
  }

  return children;
};

export default ProtectedRoute;

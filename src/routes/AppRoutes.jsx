import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../utils/constants';

// Layouts
const DashboardLayout = lazy(() => import('../components/layout/DashboardLayout'));
const AuthLayout = lazy(() => import('../components/layout/AuthLayout'));

// Pages (Placeholders for now)
const Login = lazy(() => import('../pages/auth/Login'));
const ForceChangePassword = lazy(() => import('../pages/auth/ForceChangePassword'));
// Pages - Admin
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const UsersList = lazy(() => import('../pages/admin/UsersList'));
const SellersList = lazy(() => import('../pages/admin/SellersList'));
const CreateSeller = lazy(() => import('../pages/admin/CreateSeller'));
const AdminProductsList = lazy(() => import('../pages/admin/ProductsList'));
const CategoriesList = lazy(() => import('../pages/admin/CategoriesList'));
const AdminOrdersList = lazy(() => import('../pages/admin/OrdersList'));
const AuditLogsList = lazy(() => import('../pages/admin/AuditLogsList'));

// Pages - Seller
const SellerDashboard = lazy(() => import('../pages/seller/SellerDashboard'));
const SellerProductsList = lazy(() => import('../pages/seller/ProductsList'));
const AddProduct = lazy(() => import('../pages/seller/AddProduct'));
const SellerOrdersList = lazy(() => import('../pages/seller/OrdersList'));
const StoreProfile = lazy(() => import('../pages/seller/StoreProfile'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/force-change-password" element={<ForceChangePassword />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersList />} />
          <Route path="sellers" element={<SellersList />} />
          <Route path="sellers/new" element={<CreateSeller />} />
          <Route path="products" element={<AdminProductsList />} />
          <Route path="categories" element={<CategoriesList />} />
          <Route path="orders" element={<AdminOrdersList />} />
          <Route path="audit-logs" element={<AuditLogsList />} />
        </Route>

        {/* Seller Routes */}
        <Route path="/seller" element={
          <ProtectedRoute allowedRoles={[ROLES.SELLER]}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProductsList />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/:id/edit" element={<AddProduct />} />
          <Route path="orders" element={<SellerOrdersList />} />
          <Route path="profile" element={<StoreProfile />} />
        </Route>

        {/* Redirect root based on auth, handled inside a component or default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

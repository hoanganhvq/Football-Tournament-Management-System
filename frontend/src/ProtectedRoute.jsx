import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
export const ProtectedRoute = () => {
    const {isAuthenticated} = useAuth();

  return isAuthenticated ? <Outlet/>: <Navigate to="/sign-in" replace/>}

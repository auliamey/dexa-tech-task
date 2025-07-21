// src/components/private-route/PrivateRoute.tsx
import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface PrivateRouteProps {
  roles?: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Loading…</div>
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  // Render whatever nested routes you’ve declared
  return <Outlet />
}

export default PrivateRoute

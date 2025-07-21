import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import AbsencePage from '@/pages/AbsencePage'
import PrivateRoute from '@/components/private-route/PrivateRoute'
import ProfilePage from '@/pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import PrivateLayout from './components/layouts/PrivateLayout'

const App: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route element={<PrivateRoute roles={['employee','admin']} />}>
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/absence"  element={<AbsencePage />} />
        <Route path="/profile"  element={<ProfilePage />} />
      </Route>
    </Route>

    <Route element={<PrivateRoute roles={['admin']} />}>
      <Route element={<PrivateLayout />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
)

export default App

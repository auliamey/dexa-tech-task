import React, { createContext, useContext, useEffect, useState } from 'react'
import { getProfile } from '@/services/employee'
import { useNavigate } from 'react-router-dom'
import type { Employee } from '@/types/employee'

interface AuthContextType {
  user: Employee | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate              = useNavigate()

  const refresh = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const profile = await getProfile()
      setUser(profile)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
      navigate('/login', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

const LogoutButton: React.FC = () => {
  const { logout } = useAuth()
  return (
    <Button
      onClick={logout}
      className="w-full text-left"
    >
      Logout
    </Button>
  )
}

export default LogoutButton

import { useAuth } from '@/contexts/AuthContext'

export default function WelcomeHeader() {
  const { user } = useAuth()
  return (
    <h1 className="text-2xl font-bold mb-6">
      Welcome Back, {user?.name}!
    </h1>
  )
}
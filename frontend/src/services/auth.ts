import api from './api'
import type { LoginResponse } from '@/types/auth'

export const login = (email: string, password: string) =>
  api
    .post<LoginResponse>('/auth/login', { email, password })
    .then(res => res.data)

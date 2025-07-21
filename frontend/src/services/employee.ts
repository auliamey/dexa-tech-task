import api from './api'
import type { Employee } from '@/types/employee';

export const getEmployees = () =>
  api.get<Employee[]>('/employee').then(res => res.data);

export const getProfile = () =>
  api
    .get<Employee>(`/employee/me`)
    .then(res => res.data)

export const updateProfile = (
  payload: { name: string }
) =>
  api
    .put<Employee>('/employee/me', payload)
    .then(res => res.data)

export const createEmployee = (
  payload: { name: string; email: string; password: string; role: string }
) =>
  api
    .post<Employee>('/employee', payload)
    .then(r => r.data);

export const updateEmployee = (
  id: number,
  payload: { name?: string; email?: string; role?: string; password?: string; }
) =>
  api
    .put<Employee>(`/employee/${id}`, payload)
    .then(r => r.data);

export const deleteEmployee = ( id: number) =>
  api.delete(`/employee/${id}`);
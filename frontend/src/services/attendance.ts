import api from './api'
import type { AttendanceRecord } from '@/types/attendance';

export const getAttendance = () =>
  api.get<AttendanceRecord[]>('/attendance').then(res => res.data);

export const getAllAttendance = () =>
  api.get<AttendanceRecord[]>('/attendance/all').then(res => res.data);

export const createAttendance = (photo: File) => {
  const formData = new FormData()
  formData.append('photo', photo)
  formData.append('timestamp', new Date().toISOString())

  return api.post(
    '/attendance',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
}

export default api;
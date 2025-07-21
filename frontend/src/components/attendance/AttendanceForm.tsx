import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Toast from '@radix-ui/react-toast'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createAttendance } from '@/services/attendance'

const AttendanceForm: React.FC = () => {
  const [photo, setPhoto] = useState<File | null>(null)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const navigate = useNavigate()

  const [open, setOpen]               = useState(false)
  const [toastTitle, setToastTitle]   = useState('')
  const [toastDesc, setToastDesc]     = useState('')
  const [toastVariant, setVariant]    = useState<'success'|'error'>('success')

  const showToast = (
    title: string,
    description: string,
    variant: 'success'|'error' = 'success'
  ) => {
    setToastTitle(title)
    setToastDesc(description)
    setVariant(variant)
    setOpen(true)
  }


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!photo) {
      setError('Please select a photo.')
      return
    }

    try {
      await createAttendance(photo)
      showToast('Success', 'Attendance recorded successfully!', 'success')
      setTimeout(() => {
         navigate('/dashboard')
      }, 1000)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to record attendance.'
      showToast('Error', msg, 'error')
    }
  }

  return (
    <Toast.Provider swipeDirection="right">
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-start">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Absen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Waktu</label>
              <input
                type="text"
                readOnly
                value={new Date().toLocaleString()}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="photo" className="block mb-1 font-medium">
                Foto Bukti
              </label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm">{success}</p>
            )}

            <Button type="submit" className="w-full">
              Submit Absence
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>

    <Toast.Root
        className={`${
          toastVariant === 'success'
            ? 'border-green-500 bg-green-50'
            : 'border-red-500 bg-red-50'
        } border-l-4 p-4 rounded shadow-lg`}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="font-semibold">{toastTitle}</Toast.Title>
        <Toast.Description className="mt-1 text-sm">
          {toastDesc}
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 outline-none z-50" />
    </Toast.Provider>
  )
}

export default AttendanceForm

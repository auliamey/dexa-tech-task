import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Toast from '@radix-ui/react-toast'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getProfile, updateProfile } from '@/services/employee'
import type { Employee } from '@/types/employee'


const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<Employee | null>(null)
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const navigate              = useNavigate()

  const [openToast, setOpenToast] = useState(false)
  const [toastTitle, setToastTitle] = useState('')
  const [toastDesc, setToastDesc] = useState('')
  const [toastVariant, setToastVariant] = useState<'success'|'error'>('success')

  const showToast = (
    title: string,
    description: string,
    variant: 'success'|'error' = 'success'
  ) => {
    setToastTitle(title)
    setToastDesc(description)
    setToastVariant(variant)
    setOpenToast(true)
  }

  useEffect(() => {
    getProfile()
      .then(data => {
        setProfile(data)
        setName(data.name)
      })
      .catch(() => navigate('/dashboard'))
    
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const updated = await updateProfile({ name })
      setProfile(updated)
      setSuccess('Profile updated successfully')
      showToast(
        'Profile updated',
        `Profile updated successfully.`,
        'success'
      )
    } catch (err: any) {
      showToast(
        'Error Updating Profile',
        'Failed to update profile.',
        'error'
      )
    }
  }

  return (
    <Toast.Provider swipeDirection="right">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile?.email} disabled />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" type="text" value={profile?.role} disabled />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Toast.Root
        className={`${
          toastVariant === 'success'
            ? 'border-green-500 bg-green-50'
            : 'border-red-500 bg-red-50'
        } border-l-4 p-4 rounded shadow-lg`}
        open={openToast}
        onOpenChange={setOpenToast}
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

export default ProfileForm

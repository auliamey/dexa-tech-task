import React, { useState } from 'react'
import * as Toast from '@radix-ui/react-toast'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createEmployee } from '@/services/employee'

interface Props {
  onCreated: () => void
}

export default function AdminEmployeeForm({ onCreated }: Props) {
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [password, setPass] = useState('')
  const [role, setRole]     = useState<'employee'|'admin'>('employee')

  const [openToast, setOpenToast] = useState(false)
  const [toastTitle, setToastTitle] = useState('')
  const [toastDesc, setToastDesc] = useState('')
  const [toastVariant, setToastVariant] = useState<'success'|'error'>('success')

  const [confirmOpen, setConfirmOpen] = useState(false)

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

  const doCreate = async () => {
    try {
      await createEmployee({ name, email, password, role })
      showToast(
        'Employee Created',
        `${name} has been added successfully.`,
        'success'
      )
      setName(''); setEmail(''); setPass(''); setRole('employee')
      onCreated()
    } catch (err: any) {
      showToast(
        'Error Creating Employee',
        err.response?.data?.message || 'Failed to create employee.',
        'error'
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmOpen(true)
  }

  return (
    <Toast.Provider swipeDirection="right">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <h3 className="text-lg font-semibold">Add Employee</h3>

        <div>
          <Label htmlFor="ename">Name</Label>
          <Input
            id="ename"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="eemail">Email</Label>
          <Input
            id="eemail"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="epass">Password</Label>
          <Input
            id="epass"
            type="password"
            value={password}
            onChange={e => setPass(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="erole">Role</Label>
          <select
            id="erole"
            className="block w-full border rounded px-2 py-1"
            value={role}
            onChange={e => setRole(e.target.value as 'employee'|'admin')}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger asChild>
            <Button type="submit" className="w-full">
              Create
            </Button>
          </DialogTrigger>

          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <DialogTitle>Confirm Create</DialogTitle>
              <DialogDescription>
                Are you sure you want to create <strong>{name || 'this employee'}</strong>?
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button >
                    Cancel
                  </Button>
                </DialogClose>
                <Button onClick={() => { setConfirmOpen(false); doCreate() }}>
                  Yes, Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </form>

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

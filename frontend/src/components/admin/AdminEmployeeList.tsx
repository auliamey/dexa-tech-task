import { useEffect, useState } from "react"
import * as Toast from "@radix-ui/react-toast"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog"
import {
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "@/services/employee"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import {
  Edit2Icon,
  Trash2Icon,
} from 'lucide-react'
import type { Employee } from "@/types/employee"

const PAGE_SIZE = 5

interface AdminEmployeeListProps {
  refreshTrigger: boolean
}

export default function AdminEmployeeList({ refreshTrigger }: AdminEmployeeListProps) {
  const [emps, setEmps] = useState<Employee[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [role, setRole] = useState<"employee" | "admin">("employee")
  const [currentPage, setCurrentPage] = useState(1)

  const [openToast, setOpenToast] = useState(false)
  const [toastTitle, setToastTitle] = useState("")
  const [toastDesc, setToastDesc] = useState("")
  const [toastVariant, setToastVariant] = useState<"success" | "error">(
    "success"
  )

  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const showToast = (
    title: string,
    description: string,
    variant: "success" | "error" = "success"
  ) => {
    setToastTitle(title)
    setToastDesc(description)
    setToastVariant(variant)
    setOpenToast(true)
  }

  const refresh = () => {
    getEmployees().then(setEmps)
  }

   useEffect(refresh, [refreshTrigger])

  const startEdit = (emp: Employee) => {
    setEditingId(emp.id)
    setName(emp.name)
    setRole(emp.role as any)
  }

  const handleSaveConfirm = async () => {
    if (editingId == null) return
    try {
      await updateEmployee(editingId, { name, role })
      showToast("Employee Updated", `${name} has been updated.`, "success")
      setEditingId(null)
      refresh()
    } catch (err: any) {
      console.error(err)
      showToast(
        "Update Failed",
        err.response?.data?.message || "Could not update employee.",
        "error"
      )
    } finally {
      setConfirmUpdateOpen(false)
    }
  }

  const handleDeleteConfirm = async () => {
    const id = confirmDeleteId!
    try {
      await deleteEmployee(id)
      showToast("Employee Deleted", `Employee was removed.`, "success")
      refresh()
    } catch (err: any) {
      console.error(err)
      showToast(
        "Deletion Failed",
        err.response?.data?.message || "Could not delete employee.",
        "error"
      )
    } finally {
      setConfirmDeleteId(null)
    }
  }

  const totalPages = Math.ceil(emps.length / PAGE_SIZE)
  const startIdx = (currentPage - 1) * PAGE_SIZE
  const pageEmps = emps.slice(startIdx, startIdx + PAGE_SIZE)

  return (
    <Toast.Provider swipeDirection="right">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">All Employees</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {pageEmps.map((e) => (
            <div
              key={e.id}
              className="bg-white p-6 rounded-lg shadow flex flex-col items-center"
            >
              {editingId === e.id ? (
                <div className="w-full space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="block w-full border rounded px-2 py-1"
                      value={role}
                      onChange={(ev) =>
                        setRole(ev.target.value as "employee" | "admin")
                      }
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" onClick={() => setConfirmUpdateOpen(true)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="text-lg font-medium">{e.name}</p>
                    <p className="text-sm text-gray-500">{e.email}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {e.role}
                    </p>
                  </div>
                  <div className="mt-auto flex space-x-2">
                    <Button size="sm" onClick={() => startEdit(e)}>
                      <Edit2Icon className="mr-1" size={16} />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setConfirmDeleteId(e.id)}
                    >
                      <Trash2Icon className="mr-1" size={16} />
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-disabled={currentPage === 1}
            />
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === currentPage}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
            <PaginationNext
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              aria-disabled={currentPage === totalPages}
            />
          </Pagination>
        )}
      </div>

      <Dialog open={confirmUpdateOpen} onOpenChange={setConfirmUpdateOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent showCloseButton={false}>
            <DialogTitle>Confirm Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to save changes to <strong>{name}</strong>?
            </DialogDescription>
            <DialogFooter>
              <Button onClick={() => setConfirmUpdateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfirm}>Yes, Save</Button>
            </DialogFooter>
            <DialogClose className="sr-only" />
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteId(null)
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogContent showCloseButton={false}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee?
            </DialogDescription>
            <DialogFooter>
              <Button onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Yes, Delete
              </Button>
            </DialogFooter>
            <DialogClose className="sr-only" />
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Toast */}
      <Toast.Root
        className={`${
          toastVariant === "success"
            ? "border-green-500 bg-green-50"
            : "border-red-500 bg-red-50"
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

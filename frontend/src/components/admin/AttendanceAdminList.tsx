import { useEffect, useState } from "react"
import { getAllAttendance } from "@/services/attendance"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import type { AttendanceRecord } from "@/types/attendance"

const API_BASE = import.meta.env.VITE_BACKEND_URL
const PAGE_SIZE = 5

export default function AttendanceAdminList() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getAllAttendance().then(setRecords)
  }, [])

  const totalPages = Math.ceil(records.length / PAGE_SIZE)
  const startIdx = (currentPage - 1) * PAGE_SIZE
  const pageRecords = records.slice(startIdx, startIdx + PAGE_SIZE)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">All Attendance</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {pageRecords.map((r) => (
          <div
            key={r.id}
            className="bg-white p-6 rounded-lg shadow flex flex-col items-center"
          >
            <Avatar className="mb-4">
              {r.photo_path ? (
                <AvatarImage
                  src={`${API_BASE}${r.photo_path}`}
                  alt="attendance proof"
                />
              ) : (
                <AvatarFallback>?</AvatarFallback>
              )}
            </Avatar>
            <div className="text-center space-y-1">
              <p className="text-sm">
                {new Date(r.timestamp).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">User #{r.employee_id}</p>
            </div>
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
  )
}

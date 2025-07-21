import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getAttendance,
  getAllAttendance,
} from '@/services/attendance'
import type { AttendanceRecord } from '@/types/attendance'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const API_BASE = import.meta.env.VITE_BACKEND_URL 
const PAGE_SIZE = 6

export default function AttendanceHistory() {
  const { user, loading } = useAuth()
  const [records, setRecords]         = useState<AttendanceRecord[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [checkedInToday, setCheckedInToday] = useState(false)

  useEffect(() => {
    if (loading || !user) return
    const fetchFn = user.role === 'admin' ? getAllAttendance : getAttendance
    fetchFn().then(data => {
      setRecords(data)
      const today = new Date().toDateString()
      setCheckedInToday(
        data.some(r => new Date(r.timestamp).toDateString() === today)
      )
      setCurrentPage(1)
    })
  }, [user, loading])

  if (loading) {
    return <p>Loading attendance…</p>
  }

  const totalPages = Math.ceil(records.length / PAGE_SIZE)
  const startIdx   = (currentPage - 1) * PAGE_SIZE
  const pageRecs   = records.slice(startIdx, startIdx + PAGE_SIZE)

  return (
    <>
      {/* Today’s check-in banner */}
      <div className="mb-8">
        <div
          className={`p-6 rounded-lg ${
            checkedInToday
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {checkedInToday
            ? '✅ You have checked in today'
            : "❌ You haven't checked in today"}
        </div>
      </div>

      {/* History list */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          {user?.role === 'admin'
            ? 'All Attendance Records'
            : 'My Attendance History'}
        </h2>

        <div className="space-y-4">
          {pageRecs.length === 0 && (
            <p className="text-gray-600">No attendance records yet.</p>
          )}
          {pageRecs.map(r => (
            <div
              key={r.id}
              className="bg-white p-4 rounded-lg shadow-sm flex items-center"
            >
              <Avatar className="mr-4">
                {r.photo_path ? (
                  <AvatarImage
                    src={`${API_BASE}${r.photo_path}`}
                    alt="proof"
                  />
                ) : (
                  <AvatarFallback>?</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  {new Date(r.timestamp).toLocaleString()}
                </p>
                {user?.role === 'admin' && (
                  <p className="text-xs text-gray-500">
                    Employee ID: {r.employee_id}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationPrevious
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              aria-disabled={currentPage === 1}
            />
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
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
                setCurrentPage(p => Math.min(totalPages, p + 1))
              }
              aria-disabled={currentPage === totalPages}
            />
          </Pagination>
        )}
      </section>
    </>
  )
}

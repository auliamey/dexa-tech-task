import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  HomeIcon,
  CalendarCheckIcon,
  UserIcon,
  UsersIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from 'lucide-react'
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
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isOpen: boolean
  toggle: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const { user, logout } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const links = [
    { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboardIcon },
    { to: '/absence',   label: 'Absence',   Icon: CalendarCheckIcon },
    { to: '/profile',   label: 'Profile',   Icon: UserIcon },
    ...(user?.role === 'admin'
      ? [{ to: '/admin', label: 'Admin', Icon: UsersIcon }]
      : []),
  ]

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-white border-r
        flex flex-col overflow-hidden
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
      `}
    >
      <Button
        onClick={toggle}
        className="absolute top-4 right-0 -mr-4 p-1 bg-white border rounded-full shadow"
      >
        {isOpen ? <HomeIcon size={16}/> : <HomeIcon size={16}/>}
      </Button>

      <h2
        className={`
          mt-8 px-4 text-xl font-bold
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
      >
        Menu
      </h2>

      <nav className="flex-1 mt-6 overflow-y-auto space-y-2">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center h-10 px-2 rounded hover:bg-gray-100 transition-colors ${
                isActive ? 'bg-gray-200 font-semibold' : ''
              }`
            }
          >
            <Icon
              className="flex-shrink-0"
              size={20}
            />
            <span
              className={`
                ml-3
                transition-opacity duration-300
                ${isOpen ? 'opacity-100' : 'opacity-0'}
              `}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* <div className="px-4 py-6">
        <Button
          onClick={logout}
          className="
            flex items-center w-full h-10
            px-4 rounded hover:bg-gray-100
            transition-colors
          "
        >
          <LogOutIcon size={20} />
          <span
            className={`
              ml-3 transition-opacity duration-300
              ${isOpen ? 'opacity-100' : 'opacity-0'}
            `}
          >
            Logout
          </span>
        </Button>
      </div> */}
      <div className="px-4 py-6">
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center w-full h-10 px-4 rounded hover:bg-gray-100 transition-colors"
            >
              <LogOutIcon size={20} />
              <span
                className={`
                  ml-3 transition-opacity duration-300
                  ${isOpen ? 'opacity-100' : 'opacity-0'}
                `}
              >
                Logout
              </span>
            </Button>
          </DialogTrigger>

          <DialogPortal>
            <DialogOverlay />
            <DialogContent showCloseButton={false}>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out?
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setConfirmOpen(false)
                    logout()
                  }}
                >
                  Yes, Logout
                </Button>
              </DialogFooter>
              <DialogClose className="sr-only" />
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>
    </aside>
  )
}

export default Sidebar

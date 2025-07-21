import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/sidebar/Sidebar'

export default function PrivateLayout() {
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => setIsOpen(o => !o)

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <main
        className={`
          flex-1
          bg-gray-50
          min-h-screen
          p-8
          transition-all duration-300 ease-in-out
          ${isOpen ? 'ml-64' : 'ml-16'}
        `}
      >
        <Outlet />
      </main>
    </div>
  )
}

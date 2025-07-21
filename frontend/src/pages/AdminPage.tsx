import React, { useState } from 'react';
import AdminEmployeeForm from '@/components/admin/AdminForm';
import AdminEmployeeList from '@/components/admin/AdminEmployeeList';
import AttendanceAdminList from '@/components/admin/AttendanceAdminList';

const AdminPage: React.FC = () => {
  const [refreshFlag, setRefreshFlag] = useState(false)

  const handleCreated = () => {
    setRefreshFlag(f => !f)
  }

  return (
    <div className="flex">
      <main className="flex-1 bg-gray-50 min-h-screen p-8 space-y-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <section className="flex justify-center">
          <div className="max-w-xl w-full">
            <AdminEmployeeForm onCreated={handleCreated} />
          </div>
        </section>
        <section className='gap-3'>
          <AdminEmployeeList   refreshTrigger={refreshFlag} />
          <AttendanceAdminList />
        </section>
      </main>
    </div>
  );
}

export default AdminPage;

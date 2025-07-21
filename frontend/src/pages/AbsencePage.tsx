import React from 'react';
import AttendanceForm from '@/components/attendance/AttendanceForm';

const AbsencePage: React.FC = () => (
  <div className="flex">
    <main className="flex-1 bg-gray-50 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Absence Form</h1>
      <AttendanceForm />
    </main>
  </div>
);

export default AbsencePage;
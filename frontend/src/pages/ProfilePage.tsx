import React from 'react'
import ProfileForm from '@/components/profile/ProfileForm'

const ProfilePage: React.FC = () => (
  <div className="flex">
    <main className="flex-1 bg-gray-50 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <ProfileForm />
    </main>
  </div>
);
export default ProfilePage;

// Renders the dashboard entry screen where users manage their projects.
"use client"



import React from 'react'
import useCurrentUser from '@/app/hooks/useCurrentUser'
import FilesList from './_components/FilesList';

function Dashboard() {
  const { user }: any = useCurrentUser();

  React.useEffect(() => {
    if (user) {
      // sync user to our MongoDB (or in-memory fallback)
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name || user.given_name, email: user.email, image: user.image })
      }).catch(e => console.error(e))
    }
  }, [user])

  return (
    <div className="h-full bg-white">
      <FilesList />
    </div>
  )
}

export default Dashboard;


"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateTeamRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Team creation flow removed; redirect to project creation
    router.replace('/projects/create')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Team creation moved</h2>
        <p className="text-gray-500">Redirecting to project creation...</p>
      </div>
    </div>
  )
}
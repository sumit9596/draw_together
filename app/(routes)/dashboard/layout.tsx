"use client";
// Protects the dashboard view and loads its projects into shared client state.
import useCurrentUser from '@/app/hooks/useCurrentUser'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FileListContext } from '@/app/_context/FilesListContext';
import { endLoading, startLoading } from '@/components/loadingEvents';
import Header from '@/app/_components/Header';


function DashboardLayout({

  children,
}: Readonly<{ children: React.ReactNode; }>
) {
  const { user }: any = useCurrentUser();
  const router = useRouter();
  useEffect(() => {
    user && checkTeam();
  }, [user])

  const checkTeam = async () => {
    try {
      startLoading()
      const res = await fetch('/api/projects')
      if (!res.ok) return
      const list = await res.json()
      if (!list?.length) router.push('/teams/create')
      else {
        // populate file list context from projects so FilesList shows items
        const mapped = list.map((p: any) => ({
          _id: p._id || p.id,
          fileName: p.name,
          _creationTime: new Date(p.createdAt || p._id?._creationTime || Date.now()).getTime(),
          createdBy: p.owner,
        }))
        setFileList_(mapped)
        endLoading()
      }
    } catch (e) {
      console.error(e)
      endLoading()
    }
  }

  const [fileList_, setFileList_] = useState();

  return (
    <div className="min-h-screen bg-slate-50">
      <FileListContext.Provider value={{ fileList_, setFileList_ }}>
        <Header />
        <div className="mx-auto h-[calc(100vh-4rem)] max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-full min-h-0 overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </FileListContext.Provider>
    </div >
  )
}

export default DashboardLayout
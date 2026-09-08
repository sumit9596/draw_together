// Displays project records and handles opening, renaming, and deleting them.
import { FileListContext } from '@/app/_context/FilesListContext';
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { startLoading } from '@/components/loadingEvents';


export interface FILE {
  _id: string;
  fileName: string;
  createdBy: string;
  edited: boolean;
  archive: boolean;
  document: string;
  whiteboard: string;
  teamId: string;
  _creationTime: number;
}
function FilesList() {
  const { fileList_, setFileList_ } = useContext(FileListContext);
  const [fileList, setFileList] = useState<any>();
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter();
  const isLoading = fileList === undefined;

  useEffect(() => {
    if (fileList_ !== undefined) {
      setFileList(fileList_);
    }
  }, [fileList_]);

  const beginEdit = (file: FILE) => {
    setEditingId(file._id)
    setEditingName(file.fileName || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const saveEdit = async (file: FILE) => {
    const newName = editingName.trim()
    if (!newName || newName === file.fileName) {
      cancelEdit()
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: file._id, name: newName })
      })
      if (res.ok) {
        const updated = await res.json()
        const updatedList = (fileList || []).map((f: any) => f._id === updated._id ? { ...f, fileName: updated.name } : f)
        setFileList(updatedList)
        setFileList_ && setFileList_(updatedList)
        cancelEdit()
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err?.error || 'Could not rename project')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to rename project')
    } finally {
      setIsSaving(false)
    }
  }

  const requestDelete = (fileId: string) => {
    setConfirmingDeleteId(fileId)
  }

  const cancelDelete = () => {
    setConfirmingDeleteId(null)
  }

  const confirmDelete = async (fileId: string) => {
    setDeletingId(fileId)
    try {
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fileId })
      })

      if (res.status === 204) {
        const updatedList = (fileList || []).filter((f: any) => f._id !== fileId)
        setFileList(updatedList)
        setFileList_ && setFileList_(updatedList)
        setConfirmingDeleteId(null)
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err?.error || 'Could not delete project')
      }
    } catch (err) {
      console.error(err)
      alert('Failed to delete project')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-br from-white to-slate-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">My Projects</h2>
              <p className="mt-1 text-sm text-slate-500">Manage, open, rename, or delete your projects.</p>
            </div>
            <button
              onClick={() => router.push('/projects/create')}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              + New Project
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto pb-6">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="sticky top-0 bg-slate-50/95 backdrop-blur">
              <tr className="*:text-left *:text-sm *:font-semibold *:text-slate-700">
                <th className="px-6 py-3 whitespace-nowrap">Project Name</th>
                <th className="px-6 py-3 whitespace-nowrap">Created</th>
                <th className="px-6 py-3 whitespace-nowrap">Last Modified</th>
                <th className="px-6 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12">
                    <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
                      Loading projects...
                    </div>
                    <div className="mt-6 space-y-3">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="grid grid-cols-4 gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                          <div className="col-span-2 flex items-center gap-3">
                            <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
                            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                          </div>
                          <div className="h-4 w-24 animate-pulse rounded bg-slate-200 self-center" />
                          <div className="h-4 w-24 animate-pulse rounded bg-slate-200 self-center" />
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : fileList && fileList.length > 0 ? (
                fileList.map((file: FILE, index: number) => (
                  <tr key={index}
                    className="border-t border-slate-100 transition hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-100">
                          <svg className="h-4 w-4 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        {editingId === file._id ? (
                          <div className="min-w-[220px] space-y-2">
                            <input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit(file)
                                if (e.key === 'Escape') cancelEdit()
                              }}
                              className="w-full rounded-lg border border-cyan-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-2 ring-cyan-100"
                              autoFocus
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => saveEdit(file)}
                                disabled={isSaving}
                                className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                              >
                                {isSaving ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={isSaving}
                                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="font-medium text-slate-900">{file.fileName}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{moment(file._creationTime).format('DD MMM YYYY')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{moment(file._creationTime).format('DD MMM YYYY')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onMouseEnter={() => {
                            void router.prefetch('/workspace/' + file._id)
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            startLoading();
                            router.push('/workspace/' + file._id);
                          }}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white transition hover:bg-slate-800"
                        >
                          Open
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            beginEdit(file)
                          }}
                          className="rounded-lg px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
                        >
                          Edit
                        </button>
                        {confirmingDeleteId === file._id ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                confirmDelete(file._id)
                              }}
                              disabled={deletingId === file._id}
                              className="rounded-lg bg-rose-600 px-3 py-1.5 font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
                            >
                              {deletingId === file._id ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                cancelDelete()
                              }}
                              disabled={deletingId === file._id}
                              className="rounded-lg px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-60"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              requestDelete(file._id)
                            }}
                            className="rounded-lg px-3 py-1.5 font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="mb-2 h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="font-medium text-slate-600">No projects yet</p>
                      <p className="text-sm text-slate-400">Create a new project to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FilesList
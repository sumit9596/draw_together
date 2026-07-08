"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import WorkspaceHeader from '../_components/WorkspaceHeader'
import { FILE } from '../../dashboard/_components/FilesList';
import dynamic from 'next/dynamic'
import { endLoading, startLoading } from '@/components/loadingEvents'
import ResizableDivider from '@/components/ResizableDivider'

function WorkspaceLoadingState() {
    return (
        <div className="flex h-full items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="w-full max-w-4xl px-6 py-8 sm:px-10 sm:py-12">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
                        <div className="mt-4 h-8 w-72 max-w-full animate-pulse rounded-2xl bg-slate-200" />
                        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-100" />
                    </div>
                    <div className="hidden rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 sm:inline-flex">
                        Preparing workspace
                    </div>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
                    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 sm:p-6">
                        <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                        <div className="mt-4 space-y-3">
                            <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
                            <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
                            <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
                        </div>
                        <div className="mt-6 rounded-2xl border border-white bg-white p-4 shadow-sm">
                            <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
                            <div className="mt-3 h-24 animate-pulse rounded-2xl bg-slate-100" />
                        </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-4 text-slate-100 sm:p-6">
                        <div className="h-4 w-24 animate-pulse rounded-full bg-white/20" />
                        <div className="mt-4 space-y-3">
                            <div className="h-3 w-full animate-pulse rounded-full bg-white/15" />
                            <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/15" />
                            <div className="h-3 w-3/5 animate-pulse rounded-full bg-white/15" />
                        </div>
                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="h-3 w-28 animate-pulse rounded-full bg-white/15" />
                            <div className="mt-3 h-28 animate-pulse rounded-2xl bg-white/10" />
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-sm text-slate-500">
                    Loading your editor and canvas in the background.
                </p>
            </div>
        </div>
    )
}

const Editor = dynamic(() => import('../_components/Editor'), {
    ssr: false,
    loading: () => <WorkspaceLoadingState />,
})
const Canvas = dynamic(() => import('../_components/Canvas'), {
    ssr: false,
    loading: () => <WorkspaceLoadingState />,
})

function Workspace(/*{ params }: any*/) {
    const params = useParams()
    const fileId = params?.fileId

    const [saveRequestId, setSaveRequestId] = useState(0);
    const [saveCompletionCount, setSaveCompletionCount] = useState(0);
    const [fileData, setFileData] = useState<FILE | any>();
    const isReady = !!fileData
    useEffect(() => {
        void import('../_components/Editor')
        void import('../_components/Canvas')
        fileId && getFileData();
    }, [fileId])
    const getFileData = async () => {
        const res = await fetch(`/api/files/${fileId}`)
        if (!res.ok) {
            console.error('Failed to fetch file data', res.status)
            return
        }
        const result = await res.json()
        setFileData(result)
        return result
    }
    const handleSave = () => {
        setSaveCompletionCount(0)
        startLoading()
        setSaveRequestId((current) => current + 1)
    }

    const handleSaveComplete = () => {
        setSaveCompletionCount((current) => {
            const next = current + 1
            if (next >= 2) {
                endLoading()
                // Refresh file data after both saves complete
                setTimeout(() => {
                    getFileData()
                }, 300)
            }
            return next
        })
    }
    return (
        <div className="h-screen flex flex-col bg-slate-50">
            <WorkspaceHeader onSave={handleSave} fileId={fileId} fileData={fileData} />

            {/* WorkSpace Content with Resizable Divider */}
            <div className="flex-1 overflow-hidden p-3 pt-2">
                {isReady ? (
                    <ResizableDivider
                        initialLeftPercent={50}
                        leftChild={
                            <Editor
                                saveRequestId={saveRequestId}
                                onSaveComplete={handleSaveComplete}
                                fileId={fileId}
                                fileData={fileData}
                            />
                        }
                        rightChild={
                            <Canvas
                                saveRequestId={saveRequestId}
                                onSaveComplete={handleSaveComplete}
                                fileId={fileId}
                                fileData={fileData}
                            />
                        }
                    />
                ) : (
                    <WorkspaceLoadingState />
                )}
            </div>
        </div>
    )
}

export default Workspace
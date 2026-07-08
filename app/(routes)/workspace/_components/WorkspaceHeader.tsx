import { Button } from '@/components/ui/button'
import { LayoutDashboard, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import useCurrentUser from '@/app/hooks/useCurrentUser'
import { toast } from 'sonner'
import { LOADING_END_EVENT } from '@/components/loadingEvents'

const blobToDataURL = (blob: Blob) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error || new Error('Failed to read image blob'))
    reader.readAsDataURL(blob)
})

const loadImageSize = (src: string) => new Promise<{ width: number, height: number }>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({ width: image.naturalWidth || image.width, height: image.naturalHeight || image.height })
    image.onerror = () => reject(new Error('Failed to load whiteboard preview'))
    image.src = src
})

function WorkspaceHeader({ onSave, fileId, fileData }: any) {
    const router = useRouter()
    const { user } = useCurrentUser()
    const [dismissAnonBanner, setDismissAnonBanner] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [awaitingAuthAfterSave, setAwaitingAuthAfterSave] = useState(false)
    const onSaveRef = useRef<any>(onSave)
    const claimInFlightRef = useRef(false)
    const lastClaimIdRef = useRef<string | null>(null)

    useEffect(() => {
        onSaveRef.current = onSave
    }, [onSave])

    // For anonymous users: open auth modal after current save cycle ends.
    useEffect(() => {
        if (!awaitingAuthAfterSave) return
        if (typeof window === 'undefined') return

        const done = () => {
            setAwaitingAuthAfterSave(false)
            setShowAuthModal(true)
        }

        window.addEventListener(LOADING_END_EVENT, done)
        const fallback = window.setTimeout(done, 3000)

        return () => {
            window.removeEventListener(LOADING_END_EVENT, done)
            window.clearTimeout(fallback)
        }
    }, [awaitingAuthAfterSave])

    // When a user signs in, if this workspace looks anonymous, attempt to claim it
    useEffect(() => {
        if (!user) return
        try {
            const id = String(fileId || (typeof window !== 'undefined' && window.location.pathname.split('/').pop()) || '')
            if (!id) return

            const claimed = typeof window !== 'undefined' ? localStorage.getItem(`anon_claimed_${id}`) : null
            const pending = typeof window !== 'undefined' ? localStorage.getItem(`pending_save_${id}`) : null
            const looksAnon = id.startsWith('anon_') || (typeof window !== 'undefined' && !!localStorage.getItem(`anon_name_${id}`))

            // If this anonymous workspace was already claimed, move to claimed workspace once.
            if (looksAnon && claimed && String(claimed) !== id) {
                router.replace(`/workspace/${claimed}`)
                return
            }

            // Claim anonymous workspace only once per workspace id.
            if (looksAnon && !claimed) {
                if (claimInFlightRef.current || lastClaimIdRef.current === id) return
                claimInFlightRef.current = true
                lastClaimIdRef.current = id

                const nameFromLocal = (typeof window !== 'undefined' && localStorage.getItem(`anon_name_${id}`)) || ''
                const name = (fileData && fileData.fileName && fileData.fileName !== 'Untitled') ? fileData.fileName : nameFromLocal

                    ; (async () => {
                        try {
                            const res = await fetch('/api/projects/claim', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ anonId: id, name })
                            })
                            if (res.ok) {
                                const j = await res.json()
                                const newProj = j.project || j.project || (j.project && j.project.id) || j.project
                                const newId = (newProj && (newProj._id || newProj.id || newProj)) || null
                                if (newId) {
                                    try { localStorage.setItem(`anon_claimed_${id}`, String(newId)) } catch (e) { }
                                    // Keep save intent across anon -> claimed workspace switch.
                                    if (pending) {
                                        try {
                                            localStorage.removeItem(`pending_save_${id}`)
                                            localStorage.setItem(`pending_save_${newId}`, '1')
                                        } catch (e) { }
                                    }
                                    // navigate to the claimed project workspace
                                    router.replace(`/workspace/${newId}`)
                                }
                            } else {
                                // ignore failures silently
                                // console.warn('claim failed', await res.text())
                            }
                        } catch (e) {
                            console.error('claim error', e)
                        } finally {
                            claimInFlightRef.current = false
                        }
                    })()
                return
            }

            // Run exactly one pending save for the current workspace id.
            try {
                if (pending) {
                    try { localStorage.removeItem(`pending_save_${id}`) } catch (e) { }
                    try {
                        if (typeof onSaveRef.current === 'function') onSaveRef.current()
                    } catch (e) { console.error('pending save failed', e) }
                }
            } catch (e) { }
        } catch (e) { }
    }, [user, fileId, fileData?.fileName, router])

    const handleDownload = async () => {
        try {
            const path = typeof window !== 'undefined' ? window.location.pathname : ''
            const segments = path.split('/').filter(Boolean)
            const workspaceIdx = segments.indexOf('workspace')
            const pathId = workspaceIdx >= 0 && segments[workspaceIdx + 1] ? segments[workspaceIdx + 1] : segments[segments.length - 1]
            const id = String(fileId || pathId || '').trim()
            if (!id) {
                toast.error('Workspace ID not found')
                return
            }

            const [zipMod, pdfMod, excalidrawMod, res] = await Promise.all([
                import('jszip'),
                import('jspdf'),
                import('@excalidraw/excalidraw'),
                fetch(`/api/files/${encodeURIComponent(id)}/export`),
            ])
            const JSZip = zipMod.default
            const { jsPDF } = pdfMod as any
            const { exportToBlob } = excalidrawMod as any

            if (!res.ok) {
                const txt = await res.text()
                toast.error('Failed to prepare document PDF')
                console.error(txt)
                return
            }

            const documentPdfBlob = await res.blob()
            const zip = new JSZip()

            const documentName = `${String(fileData?.fileName || 'document').replace(/[^a-z0-9\-_.]/gi, '_')}.pdf`
            zip.file(documentName, documentPdfBlob)

            let whiteboardPdfBlob: Blob | null = null
            try {
                const parsedWhiteboard = JSON.parse(String(fileData?.whiteboard || '[]'))
                if (Array.isArray(parsedWhiteboard) && parsedWhiteboard.length > 0) {
                    const whiteboardPngBlob = await exportToBlob({
                        elements: parsedWhiteboard,
                        appState: {
                            exportBackground: true,
                            viewBackgroundColor: '#ffffff',
                            exportScale: 1,
                            exportWithDarkMode: false,
                        },
                        files: {},
                        mimeType: 'image/png',
                    })
                    const dataUrl = await blobToDataURL(whiteboardPngBlob)
                    const { width, height } = await loadImageSize(dataUrl)
                    const pdf = new jsPDF({ unit: 'pt', format: [width, height] })
                    pdf.addImage(dataUrl, 'PNG', 0, 0, width, height)
                    whiteboardPdfBlob = pdf.output('blob')
                }
            } catch (whiteboardError) {
                console.error('Whiteboard export failed', whiteboardError)
                toast.error('Drawing export failed')
            }

            if (whiteboardPdfBlob) {
                const whiteboardName = `${String(fileData?.fileName || 'document').replace(/[^a-z0-9\-_.]/gi, '_')}.draw.pdf`
                zip.file(whiteboardName, whiteboardPdfBlob)
            }

            const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
            const zipName = `${String(fileData?.fileName || 'document').replace(/[^a-z0-9\-_.]/gi, '_')}.zip`
            const url = URL.createObjectURL(zipBlob)
            const a = document.createElement('a')
            a.href = url
            a.download = zipName
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
            toast.success('ZIP download started')
        } catch (e) {
            console.error(e)
            toast.error('Error preparing downloads')
        }
    }

    return (
        <>
            <div className='border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur'>
                <div className='mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3'>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                        <h2 className='text-base font-semibold tracking-tight text-slate-900'>Draw.together</h2>
                    </div>

                    <div className="min-w-0 flex-1 text-center">
                        {(() => {
                            const name = fileData?.fileName
                            let display = name && name !== 'Untitled' ? name : ''
                            try {
                                if (!display) {
                                    const id = fileId || (typeof window !== 'undefined' && window.location.pathname.split('/').pop())
                                    if (id && typeof window !== 'undefined') {
                                        const local = localStorage.getItem(`anon_name_${id}`)
                                        if (local) display = local
                                    }
                                }
                            } catch (e) { }
                            return (
                                <h2 className='truncate text-base font-semibold text-slate-800 md:text-lg'>
                                    {display}
                                </h2>
                            )
                        })()}
                    </div>

                    <div className='flex items-center gap-2'>
                        <Button className='h-9 gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 hover:bg-slate-100'
                            onClick={() => router.push('/dashboard')}
                        ><LayoutDashboard size={14} />Dashboard</Button>
                        <Button className='h-9 gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 hover:bg-slate-100' onClick={handleDownload}>Download</Button>
                        <Button className='h-9 gap-2 rounded-lg bg-slate-900 px-3 text-xs text-white hover:bg-slate-800'
                            onClick={() => {
                                if (!user) {
                                    try {
                                        const id = fileId || (typeof window !== 'undefined' && window.location.pathname.split('/').pop())
                                        if (id && typeof window !== 'undefined') {
                                            localStorage.setItem(`pending_save_${id}`, '1')
                                        }
                                    } catch (e) { }

                                    // Save current anonymous draft first, then prompt login.
                                    setAwaitingAuthAfterSave(true)
                                    try {
                                        if (typeof onSaveRef.current === 'function') onSaveRef.current()
                                    } catch (e) {
                                        setAwaitingAuthAfterSave(false)
                                        setShowAuthModal(true)
                                    }
                                    return
                                }
                                onSave()
                            }}
                        ><Save size={14} />Save</Button>
                    </div>
                </div>
            </div>

            {/* Anonymous banner: shown when user not signed in and workspace appears anonymous */}
            {!user && !dismissAnonBanner && (() => {
                let isAnon = false
                try {
                    const id = fileId || (typeof window !== 'undefined' && window.location.pathname.split('/').pop())
                    if (id && String(id).startsWith('anon_')) isAnon = true
                    if (!isAnon && id && typeof window !== 'undefined') {
                        const local = localStorage.getItem(`anon_name_${id}`)
                        if (local) isAnon = true
                    }
                } catch (e) { }
                if (!isAnon) return null
                const next = `/workspace/${fileId || (typeof window !== 'undefined' && window.location.pathname.split('/').pop()) || ''}`
                return (
                    <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-amber-50 px-4 py-2 text-sm text-amber-800">
                        <div>You're anonymous — sign in to save this workspace.</div>
                        <div className="flex items-center gap-2">
                            <button className="rounded-md bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-800" onClick={() => router.push(`/auth/login?next=${encodeURIComponent(next)}`)}>Sign in</button>
                            <button className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100" onClick={() => setDismissAnonBanner(true)}>Dismiss</button>
                        </div>
                    </div>
                )
            })()}

            {/* Inline Auth Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-semibold">Sign in to continue</h3>
                        <p className="mt-2 text-sm text-slate-600">Sign in to save this workspace. Your anonymous workspace can be merged into your account after signing in.</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button className="rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100" onClick={() => setShowAuthModal(false)}>Cancel</button>
                            <button className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800" onClick={() => {
                                const next = `/workspace/${fileId || (typeof window !== 'undefined' && window.location.pathname.split('/').pop()) || ''}`
                                router.push(`/auth/login?next=${encodeURIComponent(next)}`)
                            }}>Sign in</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default WorkspaceHeader
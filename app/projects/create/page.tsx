// Collects a project name and creates the first persistent workspace for a user.
"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { endLoading, startLoading } from '@/components/loadingEvents'
import Link from 'next/link'
import { ArrowRight, FolderPlus, LayoutGrid, Sparkles } from 'lucide-react'

export default function CreateProjectPage() {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        startLoading()
        try {
            const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
            if (res.ok) {
                const j = await res.json()
                const workspaceId = j._id || j.id
                if (workspaceId) {
                    router.push(`/workspace/${workspaceId}`)
                } else {
                    router.push('/dashboard')
                }
            } else {
                const j = await res.json()
                alert(j.error || 'Failed to create project')
                endLoading()
            }
        } catch (error) {
            console.error('Failed to create project', error)
            endLoading()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef6ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-medium text-cyan-700 shadow-sm">
                        <FolderPlus className="h-4 w-4" />
                        New workspace
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                            Create a workspace
                        </h1>
                        <p className="max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
                            Name it and start drawing — nothing else required.
                        </p>
                    </div>

                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950">
                        Back to dashboard
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
                    <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Create project</p>
                            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Name your workspace</h2>
                        </div>
                        <div className="rounded-2xl bg-slate-950 px-3 py-2 text-white shadow-lg shadow-slate-950/20">
                            <FolderPlus className="h-5 w-5" />
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <label className="block space-y-2">
                            <span className="text-sm font-medium text-slate-700">Project name</span>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. Website redesign, sprint planning, new app idea"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                            />
                        </label>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                            Tip: choose a short, clear name so you can find it quickly later.
                        </div>

                        <button
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={loading || !name}
                        >
                            {loading ? 'Creating…' : 'Create project'}
                            {!loading && <ArrowRight className="h-4 w-4" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

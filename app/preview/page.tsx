// Shows a visual product preview and the main workflow before users open a workspace.
import Link from 'next/link'
import Header from '@/app/_components/Header'

export default function PreviewPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Header />
            <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="absolute left-0 top-14 -z-10 h-48 w-48 rounded-full bg-cyan-200/50 blur-3xl" />
                <div className="absolute right-10 top-40 -z-10 h-56 w-56 rounded-full bg-emerald-200/50 blur-3xl" />

                <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-lg shadow-slate-200/60 sm:p-8 lg:p-10">
                    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Preview</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                Product preview that feels deliberate, not placeholder-driven.
                            </h1>
                            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                                This page shows the visual language, motion personality, and content rhythm of Draw.together so users understand what they are opening before they reach the editor.
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Surface</p>
                                    <p className="mt-1 text-sm text-slate-700">Clean header and dashboard entry point</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Flow</p>
                                    <p className="mt-1 text-sm text-slate-700">Preview, workflow, then workspace</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Purpose</p>
                                    <p className="mt-1 text-sm text-slate-700">Make the app feel usable, not empty</p>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href="/workflow" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                                    View Workflow
                                </Link>
                                <Link href="/dashboard" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                                    Open Dashboard
                                </Link>
                                <Link href="/features" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                                    Explore Features
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-4 text-slate-100 shadow-md sm:p-5">
                            <div className="flex items-center gap-2 pb-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                                <p className="ml-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">Workflow Snapshot</p>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="space-y-3 text-sm">
                                    <div className="rounded-lg bg-cyan-300/15 px-3 py-2 text-cyan-100">Step 01: Start from the dashboard</div>
                                    <div className="rounded-lg bg-emerald-300/15 px-3 py-2 text-emerald-100">Step 02: Structure ideas on the board</div>
                                    <div className="rounded-lg bg-amber-300/15 px-3 py-2 text-amber-100">Step 03: Save, revisit, and share</div>
                                </div>
                                <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
                                    Preview tone: clean, visual-first, and easy to scan, with a visible path back to the dashboard.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-8 grid gap-4 md:grid-cols-3">
                    <article className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Motion</p>
                        <h2 className="mt-2 text-lg font-semibold text-slate-900">Drawing feels alive</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Cursor flow, top loading, and quick transitions are tuned so interactions feel intentional instead of abrupt.</p>
                    </article>
                    <article className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Clarity</p>
                        <h2 className="mt-2 text-lg font-semibold text-slate-900">Readable at every size</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Typography contrast and spacing hold up on desktop and mobile, including the dashboard entry in the navbar.</p>
                    </article>
                    <article className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-700">Trust</p>
                        <h2 className="mt-2 text-lg font-semibold text-slate-900">Shows product maturity</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Preview copy and visuals look product-grade, so the app feels complete before login.</p>
                    </article>
                </section>

                <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                    <div className="grid md:grid-cols-[1fr_0.9fr]">
                        <div className="p-6 sm:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Quick Summary</p>
                            <ul className="mt-4 space-y-3 text-sm text-slate-700">
                                <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">You can understand the product quickly.</li>
                                <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">Workflow steps are easy to read.</li>
                                <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">Navigation buttons are clear and simple.</li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-slate-100 sm:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Notes</p>
                            <ul className="mt-4 space-y-3 text-sm text-slate-200">
                                <li className="rounded-xl bg-white/10 px-4 py-3">Clean layout with better spacing</li>
                                <li className="rounded-xl bg-white/10 px-4 py-3">Simple workflow snapshot card</li>
                                <li className="rounded-xl bg-white/10 px-4 py-3">Easy links to related pages</li>
                            </ul>
                            <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Status</p>
                                <p className="mt-2 text-sm">Preview page is ready.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-8">
                    <Link href="/" className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                        Back to Home
                    </Link>
                </div>
            </main>
        </div>
    )
}

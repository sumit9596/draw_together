"use client"
import Link from 'next/link'
import { ArrowRight, Sparkles, Wand2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function Hero() {
    const router = useRouter()
    const [showAnonModal, setShowAnonModal] = React.useState(false)
    const [anonName, setAnonName] = React.useState('')
    return (
        <section className="relative overflow-hidden bg-slate-50 text-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(52,211,153,0.2),_transparent_30%),linear-gradient(180deg,_#f8fbff,_#f8fafc)]" />
            <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-cyan-200/60 blur-3xl" />
            <div className="absolute right-[-6rem] top-10 h-80 w-80 rounded-full bg-emerald-200/60 blur-3xl" />

            <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                        <Sparkles className="h-4 w-4 text-cyan-600" />
                        Plan ideas, organize projects, and move faster
                    </div>

                    <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-slate-900 sm:text-5xl lg:text-6xl">
                        Sketch, plan, and work in one focused canvas.
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                        Draw.together gives you a clean space to sketch thoughts, map workflows, and launch a project directly from your browser.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
                        >
                            Sign in or get started
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <button
                            onClick={() => setShowAnonModal(true)}
                            className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-cyan-50"
                        >
                            <Wand2 className="h-4 w-4 text-cyan-600" />
                            Start a project
                        </button>
                        {showAnonModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-black/40" onClick={() => setShowAnonModal(false)} />
                                <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                                    <h3 className="text-lg font-semibold text-slate-900">Start a private workspace</h3>
                                    <p className="mt-2 text-sm text-slate-600">Enter a project name if you want one. You can save or share after signing in.</p>
                                    <input
                                        value={anonName}
                                        onChange={(e) => setAnonName(e.target.value)}
                                        placeholder="Project name (optional)"
                                        className="mt-4 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-100"
                                    />
                                    <div className="mt-4 flex justify-end gap-2">
                                        <button className="rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100" onClick={() => setShowAnonModal(false)}>Cancel</button>
                                        <button
                                            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
                                            onClick={() => {
                                                const id = `anon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
                                                try {
                                                    if (anonName && typeof window !== 'undefined') {
                                                        localStorage.setItem(`anon_name_${id}`, anonName)
                                                    }
                                                } catch (e) { }
                                                setShowAnonModal(false)
                                                router.push(`/workspace/${id}`)
                                            }}
                                        >
                                            Start
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">1. Start</p>
                            <p className="mt-2 text-sm text-slate-700">Create a workspace in seconds.</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">2. Draw</p>
                            <p className="mt-2 text-sm text-slate-700">Structure ideas on a visual canvas.</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">3. Continue</p>
                            <p className="mt-2 text-sm text-slate-700">Return later with your work preserved.</p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href="/features" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50">
                            Explore Features
                        </Link>
                        <Link href="/workflow" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50">
                            See Workflow
                        </Link>
                        <Link href="/preview" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                            Open Preview
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-cyan-200/70 via-transparent to-emerald-200/70 blur-2xl" />
                    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70 sm:p-6">
                        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs uppercase tracking-[0.28em] text-slate-500">
                            <span>Live canvas preview</span>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] tracking-[0.24em] text-emerald-700">
                                drawing
                            </span>
                        </div>

                        <div className="relative mt-4 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(248,250,252,0.98))] p-4 text-slate-950 sm:p-6">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:26px_26px] opacity-70" />
                            <div className="relative">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Sparkles className="h-4 w-4 text-cyan-600" />
                                    Notes, flow, and sketch lines come alive
                                </div>

                                <svg viewBox="0 0 420 300" className="mt-4 h-[260px] w-full sm:h-[320px]" aria-hidden="true">
                                    <defs>
                                        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                                            <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#000" floodOpacity="0.12" />
                                        </filter>
                                    </defs>

                                    <g className="shapes-mixer" transform="translate(40,30)">
                                        <g filter="url(#softShadow)">
                                            <rect x="0" y="0" width="120" height="80" rx="12" fill="#f8fafc" className="shape-fill shape-fill-card" />
                                            <circle cx="200" cy="40" r="36" fill="#dbeafe" className="shape-fill shape-fill-circle" />
                                            <rect x="280" y="10" width="88" height="60" rx="10" fill="#e6fffa" className="shape-fill shape-fill-rect" />
                                        </g>

                                        <path d="M0 0 H120 V80 H0 Z" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" className="shape-outline shape-outline-card" />
                                        <circle cx="200" cy="40" r="36" fill="none" stroke="#0ea5e9" strokeWidth="3.2" strokeLinecap="round" className="shape-outline shape-outline-circle" />
                                        <path
                                            d="M290 10 H358 A10 10 0 0 1 368 20 V60 A10 10 0 0 1 358 70 H290 A10 10 0 0 1 280 60 V20 A10 10 0 0 1 290 10"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            className="shape-outline shape-outline-rect"
                                        />

                                        <g transform="translate(12,96)" className="controls">
                                            <rect x="0" y="0" width="360" height="36" rx="10" fill="#06121a" opacity="0.06" />
                                            <circle cx="42" cy="18" r="8" fill="#06b6d4" />
                                            <circle cx="82" cy="18" r="8" fill="#10b981" />
                                            <rect x="110" y="8" width="44" height="20" rx="6" fill="#94a3b8" />
                                            <text x="170" y="22" fontSize="11" fill="#0f172a" opacity="0.6">Mix</text>
                                            <rect x="200" y="6" width="140" height="24" rx="8" fill="#fff" opacity="0.85" />
                                        </g>

                                        <path
                                            d="M16 170 C72 140, 120 210, 180 178 C230 152, 276 212, 340 184"
                                            fill="none"
                                            stroke="#0ea5e9"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            className="cursor-draw-line cursor-draw-line-primary"
                                        />
                                        <path
                                            d="M40 220 C88 180, 150 246, 204 214 C258 186, 306 232, 350 210"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeDasharray="7 9"
                                            className="cursor-draw-line cursor-draw-line-secondary"
                                        />

                                        <g className="cursor-pointer">
                                            <animateMotion
                                                dur="9s"
                                                repeatCount="indefinite"
                                                rotate="auto"
                                                path="M0 0 H120 V80 H0 Z M0 0 C38 6,118 20,236 40 M236 40 A36 36 0 1 1 235.9 40 M236 40 C254 34,268 24,280 20 M290 10 H358 A10 10 0 0 1 368 20 V60 A10 10 0 0 1 358 70 H290 A10 10 0 0 1 280 60 V20 A10 10 0 0 1 290 10 M280 70 C236 130,160 150,16 170 C72 140,120 210,180 178 C230 152,276 212,340 184 C324 198,286 210,246 214 C186 220,120 206,40 220 C88 180,150 246,204 214 C258 186,306 232,350 210"
                                            />
                                            <circle cx="-2" cy="2" r="7" fill="#38bdf8" className="cursor-ink" />
                                            <path d="M0 0 L0 24 L7 17 L13 30 L18 28 L12 15 L23 14 Z" fill="#0f172a" />
                                            <path d="M1 1 L1 21 L7 15 L12 27 L16 25 L11 14 L21 13 Z" fill="#ffffff" opacity="0.9" />
                                        </g>
                                    </g>
                                </svg>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Project ready</p>
                                        <p className="mt-2 text-sm text-slate-600">Open a workspace and start drawing right away.</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Saved flow</p>
                                        <p className="mt-2 text-sm text-slate-600">Come back later without losing your place.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .shape-fill {
                    opacity: 0.2;
                    animation-duration: 9s;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }

                .shape-fill-card {
                    animation-name: fillCard;
                }

                .shape-fill-circle {
                    animation-name: fillCircle;
                }

                .shape-fill-rect {
                    animation-name: fillRect;
                }

                .shape-outline {
                    fill: none;
                    animation-duration: 9s;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }

                .shape-outline-card {
                    stroke-dasharray: 400;
                    stroke-dashoffset: 400;
                    animation-name: drawCard;
                }

                .shape-outline-circle {
                    stroke-dasharray: 226;
                    stroke-dashoffset: 226;
                    animation-name: drawCircle;
                }

                .shape-outline-rect {
                    stroke-dasharray: 296;
                    stroke-dashoffset: 296;
                    animation-name: drawRect;
                }

                .cursor-draw-line {
                    stroke-dasharray: 430;
                    stroke-dashoffset: 430;
                    animation-duration: 9s;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                .cursor-draw-line-primary {
                    animation-name: drawPrimary;
                }

                .cursor-draw-line-secondary {
                    stroke-dasharray: 360;
                    stroke-dashoffset: 360;
                    animation-name: drawSecondary;
                }

                .cursor-pointer {
                    filter: drop-shadow(0 4px 10px rgba(15, 23, 42, 0.25));
                }

                .cursor-ink {
                    animation: inkPulse 0.9s ease-in-out infinite;
                }

                @keyframes drawCard {
                    0% {
                        stroke-dashoffset: 400;
                        opacity: 0;
                    }
                    28% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                }

                @keyframes drawCircle {
                    0%,
                    30% {
                        stroke-dashoffset: 226;
                        opacity: 0;
                    }
                    62% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                }

                @keyframes drawRect {
                    0%,
                    64% {
                        stroke-dashoffset: 296;
                        opacity: 0;
                    }
                    88% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                }

                @keyframes fillCard {
                    0%,
                    27% {
                        opacity: 0.18;
                    }
                    33%,
                    100% {
                        opacity: 1;
                    }
                }

                @keyframes fillCircle {
                    0%,
                    60% {
                        opacity: 0.18;
                    }
                    66%,
                    100% {
                        opacity: 1;
                    }
                }

                @keyframes fillRect {
                    0%,
                    86% {
                        opacity: 0.18;
                    }
                    92%,
                    100% {
                        opacity: 1;
                    }
                }

                @keyframes drawPrimary {
                    0%,
                    74% {
                        stroke-dashoffset: 430;
                        opacity: 0;
                    }
                    88% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: 0;
                        opacity: 0.82;
                    }
                }

                @keyframes drawSecondary {
                    0% {
                        stroke-dashoffset: 360;
                        opacity: 0;
                    }
                    86% {
                        stroke-dashoffset: 360;
                        opacity: 0;
                    }
                    92% {
                        opacity: 0.95;
                    }
                    100% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                }

                @keyframes inkPulse {
                    0%,
                    100% {
                        transform: scale(0.82);
                        opacity: 0.18;
                    }
                    50% {
                        transform: scale(1.12);
                        opacity: 0.45;
                    }
                }
            `}</style>
        </section>
    )
}

export default Hero
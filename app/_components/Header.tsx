"use client"
// Provides the primary navigation and account actions shared by public pages.
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useCurrentUser from '@/app/hooks/useCurrentUser'
import { clearCurrentUserCache } from '@/app/hooks/useCurrentUser'


function Header() {
    const router = useRouter()
    const { user, loading }: any = useCurrentUser()

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' })
        } catch (err) {
            console.error('Logout failed', err)
        }
        clearCurrentUserCache()
        window.location.href = '/'
    }

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 text-xs font-bold text-white">
                            DT
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-slate-900">Draw.together</span>
                    </Link>

                    <nav aria-label="Global" className="hidden items-center gap-6 md:flex">
                        <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-900" href="/features">
                            Features
                        </Link>
                        <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-900" href="/workflow">
                            Workflow
                        </Link>
                        <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-900" href="/preview">
                            Preview
                        </Link>
                        <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-900" href="/dashboard">
                            Dashboard
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {!loading && user ? (
                            <>
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                                    {user?.name || 'User'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
"use client"
import React, { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { endLoading, startLoading } from '@/components/loadingEvents'
import AuthPageShell from '../_components/AuthPageShell'
import { ArrowRight, Eye, EyeOff, Lock, Mail, LoaderCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { clearCurrentUserCache } from '@/app/hooks/useCurrentUser'

function LoginPageContent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const searchParams = useSearchParams()
    const nextParam = (searchParams && searchParams.get('next')) || '/dashboard'

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        startLoading()
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        setLoading(false)
        if (res.ok) {
            clearCurrentUserCache()
            window.location.href = nextParam || '/dashboard'
        } else {
            const j = await res.json()
            setError(j.error || 'Login failed')
            endLoading()
        }
    }

    return (
        <AuthPageShell
            badge="Welcome back"
            title="Sign in to continue your work"
            description="Access your saved projects, reopen your latest workspace, and keep moving without extra setup."
            footerText="New here?"
            footerLinkHref="/auth/register"
            footerLinkLabel="Create an account"
        >
            <form onSubmit={submit} className="space-y-5">
                {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
                        {error}
                    </div>
                )}

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Email address</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-cyan-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Password</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-cyan-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </label>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-slate-600">
                        <input type="checkbox" className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                        Remember me
                    </label>
                    <Link href="/auth/register" className="font-medium text-cyan-700 transition hover:text-cyan-800">
                        Need an account?
                    </Link>
                </div>

                <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
                        <span>Secure sign in with your saved session options.</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-4 w-4 text-cyan-600" />
                        <span>Quick access to your latest project workspace.</span>
                    </div>
                </div>

                <button
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={loading}
                >
                    {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {loading ? 'Signing in…' : 'Sign in'}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
            </form>
        </AuthPageShell>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginPageContent />
        </Suspense>
    )
}

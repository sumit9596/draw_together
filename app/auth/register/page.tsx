"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { endLoading, startLoading } from '@/components/loadingEvents'
import AuthPageShell from '../_components/AuthPageShell'
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Mail, ShieldCheck, User } from 'lucide-react'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    let passwordStrength = 0
    if (password.length >= 8) passwordStrength += 1
    if (password.length >= 12) passwordStrength += 1
    if (/[A-Z]/.test(password)) passwordStrength += 1
    if (/[0-9]/.test(password)) passwordStrength += 1
    if (/[^A-Za-z0-9]/.test(password)) passwordStrength += 1

    const passwordStrengthLabel = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][passwordStrength]
    const passwordStrengthWidth = `${Math.min(100, passwordStrength * 20)}%`

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        setLoading(true)
        startLoading()
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        })
        setLoading(false)
        if (res.ok) {
            router.push('/auth/login')
        } else {
            const j = await res.json()
            setError(j.error || 'Registration failed')
            endLoading()
        }
    }

    return (
        <AuthPageShell
            badge="Create your account"
            title="Set up your workspace"
            description="Create an account to save your work, organize projects, and come back to the same flow any time."
            footerText="Already have an account?"
            footerLinkHref="/auth/login"
            footerLinkLabel="Sign in"
        >
            <form onSubmit={submit} className="space-y-5">
                {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
                        {error}
                    </div>
                )}

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Full name</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-cyan-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                        <User className="h-4 w-4 text-slate-400" />
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            type="text"
                            placeholder="Your name"
                            autoComplete="name"
                            required
                            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </label>

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
                            placeholder="Create a password"
                            autoComplete="new-password"
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

                <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Confirm password</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-cyan-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <input
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            required
                            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </label>

                <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>Password strength</span>
                        <span className="font-medium text-slate-800">{passwordStrengthLabel}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                        <div
                            className={`h-full rounded-full transition-all ${passwordStrength >= 4 ? 'bg-emerald-500' : passwordStrength >= 2 ? 'bg-cyan-500' : 'bg-amber-500'}`}
                            style={{ width: passwordStrengthWidth }}
                        />
                    </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>We only ask for the details needed to create your account and keep your work safe.</span>
                </div>

                <button
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={loading}
                >
                    {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {loading ? 'Creating…' : 'Create account'}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
            </form>
        </AuthPageShell>
    )
}

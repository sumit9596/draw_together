"use client"
import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <div className="border-b border-slate-200 bg-white px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Overview</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Project dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Open, edit, and manage your active projects from one place.</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Link href="/features" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            Features
          </Link>
          <Link href="/projects/create" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            Create Project
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header
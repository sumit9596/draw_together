// Keeps login and registration pages visually consistent while supplying page-specific content.
import Link from 'next/link'
import type { ReactNode } from 'react'

type AuthPageShellProps = {
  badge: string
  title: string
  description: string
  footerText: string
  footerLinkHref: string
  footerLinkLabel: string
  children: ReactNode
}

export default function AuthPageShell({
  badge,
  title,
  description,
  footerText,
  footerLinkHref,
  footerLinkLabel,
  children,
}: AuthPageShellProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.10),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#eef6ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-white/60 bg-white/82 p-5 shadow-[0_28px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Draw.together</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
            </div>
            <div className="hidden rounded-full bg-slate-950 px-3 py-1 text-xs font-medium tracking-[0.18em] text-white sm:inline-flex">
              {badge}
            </div>
          </div>

          <p className="mb-6 max-w-xl text-sm leading-6 text-slate-600 sm:text-[0.95rem]">{description}</p>

          <div>{children}</div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
            {footerText}{' '}
            <Link href={footerLinkHref} className="font-semibold text-cyan-700 transition hover:text-cyan-800">
              {footerLinkLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
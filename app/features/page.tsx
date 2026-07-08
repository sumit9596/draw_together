import Link from 'next/link'
import Header from '@/app/_components/Header'

const featureGroups = [
  {
    title: 'Draw with intent',
    body: 'Free-form canvas tools, structured shapes, and quick selection controls help you move from rough concept to clear direction without friction.',
  },
  {
    title: 'Organize the work',
    body: 'Create projects, reopen saved boards, and keep context grouped so the dashboard stays useful instead of becoming clutter.',
  },
  {
    title: 'Share fast',
    body: 'Link sharing, auth flow, and workspace handoff are built for the moment when a sketch needs review or handoff.',
  },
]

const capabilityRows = [
  ['Visual blocks', 'Shapes, canvas layers, and quick layout actions keep ideas readable.'],
  ['Persistent workspaces', 'Your progress stays attached to the same project so you can continue later.'],
  ['Action-focused navigation', 'Dashboard, preview, and workflow pages are easy to reach from the same header.'],
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700">Features</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Everything you need to turn ideas into usable work.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Draw.together is built around one job: helping you move from a blank board to a useful workspace with enough detail to continue the work later.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featureGroups.map((item) => (
              <article key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Capability detail</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Practical, not ornamental.</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Each part of the product is meant to reduce setup time, keep navigation obvious, and make the dashboard feel like a real workspace instead of a placeholder screen.
                </p>
              </div>
              <div className="border-t border-slate-200 p-5 sm:p-6 md:border-l md:border-t-0">
                <div className="space-y-3">
                  {capabilityRows.map(([title, body]) => (
                    <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="font-medium text-slate-900">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link href="/" className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

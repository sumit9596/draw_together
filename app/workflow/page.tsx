// Describes the intended start-to-finish path through projects and the workspace.
import Link from 'next/link'
import Header from '@/app/_components/Header'

const steps = [
    {
        id: '01',
        title: 'Create your workspace',
        body: 'Open the dashboard, create a project, and land in a workspace ready for notes, sketches, and planning.',
    },
    {
        id: '02',
        title: 'Map the structure',
        body: 'Use the canvas to lay out rough ideas, connect related items, and keep the flow readable while the conversation is still moving.',
    },
    {
        id: '03',
        title: 'Save and iterate',
        body: 'Return later through the same workspace or dashboard item so the board stays tied to the project instead of disappearing into history.',
    },
    {
        id: '04',
        title: 'Hand off cleanly',
        body: 'Share the workspace with a link or a sign-in flow when feedback or handoff is needed.',
    },
]

export default function WorkflowPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">Workflow</p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A simple loop for focused execution.</h1>
                        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                            The workflow is lightweight, but each stage has a clear purpose: get in, map the idea, save the state, and hand it off when the board is ready.
                        </p>
                        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            The dashboard is the single place to find your projects, so the flow starts there and stays easy to revisit.
                        </div>
                        <div className="mt-8">
                            <Link href="/" className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                                Back to Home
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {steps.map((step) => (
                            <article key={step.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Step {step.id}</p>
                                <h2 className="mt-1 text-lg font-semibold">{step.title}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

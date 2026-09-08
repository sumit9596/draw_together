// Provides the dashboard navigation links for moving between workspace areas.
import React from 'react'
import { useRouter } from 'next/navigation'

function SideNav() {
    const router = useRouter()

    return (
        <div className="flex h-full w-full flex-col overflow-y-auto bg-white p-5">
            <div className="flex-1" />

            <div className="mt-auto border-t border-slate-200 pt-6">
                <button
                    onClick={() => {
                        router.push('/projects/create');
                    }}
                    className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    + New Project
                </button>
            </div>
        </div>
    )
}

export default SideNav
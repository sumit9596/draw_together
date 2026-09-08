"use client"
// Loads and caches the current account so separate client components stay in sync.
import { useEffect, useState } from 'react'

let cachedUser: any | undefined
let inFlightRequest: Promise<any | null> | null = null

const globalEvents = (globalThis as any).__dt_global_events = (globalThis as any).__dt_global_events || new EventTarget()

export function clearCurrentUserCache() {
    cachedUser = undefined
    inFlightRequest = null
    try {
        globalEvents.dispatchEvent(new Event('user-changed'))
    } catch (err) {
        // ignore event dispatch issues in older runtimes
    }
}

async function fetchCurrentUser() {
    if (cachedUser !== undefined) return cachedUser
    if (inFlightRequest) return inFlightRequest

    inFlightRequest = fetch('/api/auth/me', { cache: 'no-store' })
        .then(r => r.json())
        .then(j => {
            if (j?.ok) {
                cachedUser = j.user
                return j.user
            }
            return null
        })
        .catch(() => null)
        .finally(() => {
            inFlightRequest = null
        })

    return inFlightRequest
}

export default function useCurrentUser() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const doFetch = () => {
            setLoading(true)
            fetchCurrentUser().then((currentUser) => {
                if (!mounted) return
                setUser(currentUser)
                setLoading(false)
            }).catch(() => {
                if (!mounted) return
                setLoading(false)
            })
        }

        doFetch()

        const onUserChanged = () => {
            doFetch()
        }

        globalEvents.addEventListener('user-changed', onUserChanged)

        return () => {
            mounted = false
            try {
                globalEvents.removeEventListener('user-changed', onUserChanged)
            } catch (err) {
                // ignore cleanup issues in older runtimes
            }
        }

    }, [])

    return { user, loading }
}

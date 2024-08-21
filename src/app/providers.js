// app/providers.js
// second domain
'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useSearchParams } from 'next/navigation'

export function PHProvider({ children }) {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id');

    if (typeof window !== 'undefined') {
        posthog.init('phc_OwZ5Eo5Bfah214KJbQUu71XpFlzMRXo0nozeI8sZWNN', {
            api_host: 'https://eu.i.posthog.com',
            bootstrap: {
                sessionID: sessionId
            }
        })
    }

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
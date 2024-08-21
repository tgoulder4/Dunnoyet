'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useRouter } from "next/router";
import { usePathname } from 'next/navigation';
export function PHProvider({ children }) {
    if (typeof window !== 'undefined') {
        const url = window.location.href;
        console.log('url', url)
        const match = url.match(/[?&]session_id=([^&]+)/);

        console.log('match', match)
        if (match) {
            const sessionID = match[1];
            console.log('bootstrapping with sessionID', sessionID)
            posthog.init('phc_OwZ5Eo5Bfah214KJbQUu71XpFlzMRXo0nozeI8sZWNN', {
                api_host: 'https://eu.i.posthog.com',
                bootstrap: {
                    sessionID
                }
            })
            return <PostHogProvider client={posthog}> {children} </PostHogProvider>
        }
    } else {
        return children;
    }
}
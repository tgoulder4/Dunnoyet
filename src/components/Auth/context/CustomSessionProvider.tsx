"use server"
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
export default async function CustomSessionProvider({ children }: { children: ReactNode }) {
    const session = await auth()
    // if (session == null || session == undefined) {
    //     console.log("Session is null or undefined. Redirecting to /auth/signin.")
    //     redirect('/auth/signin')
    // }
    return (
        <SessionProvider
            session={session}
        >
            {children}
        </SessionProvider>
    )
}
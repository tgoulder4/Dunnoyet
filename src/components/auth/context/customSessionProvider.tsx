"use server"
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
// import { auth } from '@/auth'
export default async function CustomSessionProvider({ children }: { children: ReactNode }) {
    // const session = await auth();
    const isProduction = process.env.NODEENV === 'production';
    return (
        // <SessionProvider session={session}>
        { children }
        // </SessionProvider>
    )
}
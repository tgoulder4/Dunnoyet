import { SessionProvider, useSession } from 'next-auth/react'
import getServerSession from 'next-auth'
import React, { ReactNode } from 'react'
import { auth } from '@/auth'
import { authConfig } from '@/auth.config'
export default function AuthProvider({ children }: { children: ReactNode }): ReactNode {
    const { data: session } = await getServerSession(authConfig).auth()

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
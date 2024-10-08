import '@/app/globals.css'
// import 'dotenv/config'
import { ruda } from './fonts'
import { sizing } from '@/lib/constants'
import { PHProvider } from './providers'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    console.log("NODEENV: ", process.env.NODEENV)
    return (
        <html className='w-[100vw]' lang="en">
            <head>
                <link rel="icon" className='' type="image/svg+xml" href="/assets/favicon/favicon.svg"></link>
                <link rel="icon" type="image/png" href="/assets/favicon/favicon.png"></link>
                <title>Dunnoyet</title>
            </head>

            <PHProvider>
                <body>
                    {/* Layout UI */}
                    <Toaster position="top-center" toastOptions={{ style: { textAlign: 'center' }, duration: 2000 }} style={{ fontFamily: ruda.style.fontFamily, fontSize: '1.2rem', textAlign: 'center' }} />
                    <main className='h-[100vh] w-[100vw] flex flex-col overflow-x-hidden' style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>{children}</main>
                </body>
            </PHProvider>
        </html>
    )
}
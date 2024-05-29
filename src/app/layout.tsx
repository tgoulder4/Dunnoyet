import '@/app/globals.css'
// import 'dotenv/config'
import SessionProvider from "@/components/auth/context/CustomSessionProvider"
import { ruda } from './fonts'
import { sizing } from '@/lib/constants'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" className='' type="image/svg+xml" href="/assets/favicon/favicon.svg"></link>
                <link rel="icon" type="image/png" href="/assets/favicon/favicon.png"></link>
            </head>
            <body>
                {/* Layout UI */}
                <main className='h-[100vh] flex flex-col' style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>{children}</main>
            </body>
        </html>
    )
}
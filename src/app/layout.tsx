import '@/app/globals.css'
// import 'dotenv/config'
import { ruda } from './fonts'
import { sizing } from '@/lib/constants'
import { PHProvider } from './providers'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import Lesson from '@/components/UserArea/Learn/Lesson/Lesson'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html className='w-[100vw]' lang="en">
            <head>
                <link rel="icon" className='' type="image/svg+xml" href="/assets/favicon/favicon.svg"></link>
                <link rel="icon" type="image/png" href="/assets/favicon/favicon.png"></link>
                <title>Dunnoyet</title>
            </head>
            <Suspense fallback={<body>
                {/* Layout UI */}
                <main className='h-[100vh] w-[100vw] flex flex-col overflow-x-hidden' style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
                    <MainAreaNavbar style='normal' show={{ userSide: { newQuestion: false }, leftSide: { lessonTimer: false } }} />
                    <Lesson payload={{ stage: "loading", lastSaved: new Date }} />
                </main>
            </body>
            } >
                <PHProvider>
                    <body>
                        {/* Layout UI */}
                        <main className='h-[100vh] w-[100vw] flex flex-col overflow-x-hidden' style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>{children}</main>
                    </body>
                </PHProvider>
            </Suspense>
        </html>
    )
}
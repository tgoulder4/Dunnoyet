
import { merriweather, ruda } from '@/app/fonts'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
import { colours, sizing, spacing, uiBorder } from '@/lib/constants'
import React from 'react'
import getServerSession from 'next-auth';
import { authConfig } from '@/auth.config'
import { useSession } from 'next-auth/react'
function LessonLayout({
    params, children
}: {
    params: any, children: React.ReactNode
}) {
    //i want to receieve multiple updates from the db. when lesson is made, load skeleton ui. when rest payload is received, load the actual ui
    // promise .all for all the data needed for the lesson ui to load. once done setLoading false
    // const { status } = useSession({
    //     required: true,
    //     onUnauthenticated() {
    //         return {
    //             redirect: {
    //                 destination: '/api/auth/signin',
    //                 permanent: false,
    //             },
    //         }
    //     },
    // })
    // if (status === 'loading') return <></>

    return (
        <div className={` flex flex-col h-[100vh]`} style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
            <MainAreaNavbar style='normal' show={{ userSide: { newQuestion: false }, leftSide: { lessonTimer: false } }} />
            {/* the only children would be in the center grid cell */}
            {children}
        </div>
    )
}

export default LessonLayout
'use client'
import React, { useEffect } from 'react'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
import { changeColour, colours, spacing } from '@/lib/constants'
import { Loader2 } from 'lucide-react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

function CreatingLesson({ saying }: { saying: string }) {
    useEffect(() => {
        async function main() {
            //make a request to the server to create a new lesson
            const sess = await auth();
            if (!sess) return;
            const userID = sess.user?.id;
            const response = await fetch('/api/lessons/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ _userID: userID })
            });
            const link = await response.json().then((data) => data.link);
            console.log("Link from NewLesson POST Response in creatingLesson: ", link)
            redirect(`/learn/lesson/${link}`);
        };
        main();
    }, []);
    return (
        <>
            <MainAreaNavbar style='lesson' showTimer={false} />
            <div className='w-full h-full grid place-items-center'><div style={{ rowGap: spacing.gaps.largest }} className="spinner flex flex-col items-center">
                <div style={{ rowGap: spacing.gaps.groupedElement }} className='flex flex-col items-center justify-center'>
                    <Loader2 className="h-12 w-12 animate-spin" color='black' />
                    <p className="font-bold italic">CREATING LESSON</p>
                </div>
                <p style={{ color: changeColour(colours.black).lighten(35).toString() }} className="font-bold">{saying}</p>
            </div></div>
        </>
    )
}

export default CreatingLesson
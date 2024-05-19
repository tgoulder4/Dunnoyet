'use client'
import { getLoggedInUser } from '@/app/api/[[...route]]/auth';
import { createLesson, getLesson } from '@/app/api/[[...route]]/lessons';
import Lesson from '@/components/UserArea/Learn/Lesson/Lesson';
import { lessonStatePayloadSchema } from '@/lib/validation/transfer/transferSchemas';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
// import { AppTypes } from '@/app/api/[[...route]]/route';
// import { hc } from 'hono/client';
// const client = hc<AppTypes['lessonRoute']>('');
var equal = require('deep-equal');
function page() {
    //redirect them before even  sending response to client to eliminate flickering
    const u = useSession();
    const usp = useSearchParams();
    useEffect(() => {
        async function main() {
            if (!u || !u.data?.user || !u.data?.user?.id) return { status: 401 };
            const user = u.data.user;

            let param = {
                type: '',
                content: ''
            }
            const givenQ = usp.get('q');
            const givenUkP = usp.get('ukp');
            if (givenQ) {
                param = {
                    type: 'q',
                    content: givenQ
                }
            } else if (givenUkP) {
                param = {
                    type: 'ukp',
                    content: givenUkP
                }
            }
            if (!user.id) return { status: 401 };
            const parseResult = lessonStatePayloadSchema.safeParse(await fetch(`/api/lesson/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: user.id,
                    givenQ, givenUkP
                })
            }).then(res => res.json()));
            if (!parseResult.success) return { status: 500 };
            const lesson = parseResult.data;
            if (!lesson) return { status: 500 };
            //i've got everything here now - how do I send this to /lesson/[id]?
            window.location.href = `/lesson/${lesson.lessonID}&nofetch=true`
        }
        main()
    }, [])


    return (<Lesson payload={{ stage: "loading", lastSaved: new Date }} />)
}

export default page
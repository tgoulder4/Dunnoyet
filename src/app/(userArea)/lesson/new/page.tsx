'use client'
import { getLoggedInUser } from '@/app/api/[[...route]]/auth';
import { createLesson, getLesson } from '@/app/api/[[...route]]/lessons';
import Lesson from '@/components/UserArea/Learn/Lesson/Lesson';
import { lessonStatePayloadSchema } from '@/lib/validation/transfer/transferSchemas';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import axios from 'axios';
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
            const givenQ = usp.get('q');
            const givenUkP = usp.get('ukp');
            console.log("Creating POST request to /api/lessons/new")
            try {
                const response = await axios.get(`/api/lessons/new`, {
                    params: {
                        mode: givenQ ? 'New Question' : 'Free Roam',
                        content: givenQ ? givenQ : givenUkP
                    }
                })
                console.log("Response from /api/lessons/new: ", response)
                const parseResult = lessonStatePayloadSchema.safeParse(response.data);
                if (!parseResult.success) return { status: 500 };
                const lesson = parseResult.data;
                console.log("Lesson created: ", lesson)
                if (!lesson) return { status: 500 };
                //i've got everything here now - how do I send this to /lesson/[id]?
                window.location.href = `/lesson/${lesson.lessonID}`
            }
            catch (e) {
                console.error(e)
            }
        }
        main()
    }, [])
    return (<Lesson payload={{ stage: "loading", lastSaved: new Date }} />)
}

export default page
'use client'
import { getLoggedInUser } from '@/app/api/[[...route]]/auth';
import { createLesson, getLesson } from '@/app/api/[[...route]]/lessons';
import Lesson from '@/components/UserArea/Learn/Lesson/Lesson';
import { lessonStatePayloadSchema } from '@/lib/validation/transfer/transferSchemas';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import axios from 'axios';
import { client } from '@/lib/db/hono';
import { z } from 'zod';
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
            console.log("Creating GET request to /api/lessons/new")
            try {
                const response = await axios.get(`/api/lessons/new`, {
                    params: {
                        mode: givenQ ? 'New Question' : 'Free Roam',
                        content: givenQ ? givenQ : givenUkP
                    }
                })
                console.log("Response from /api/lessons/new: ", response)
                const parseResult = z.string().regex(/[0-9A-z]+/).safeParse(response.data)

                if (!parseResult.success) {
                    console.log("Failed to parse response from /api/lessons/new: ", parseResult.error.message)
                    return { status: 500 };
                }
                const lesson = parseResult.data;
                if (!lesson) return { status: 500 };
                console.log("Successfully receieved & parsed lesson: ", lesson);
                window.location.href = `/lesson/${lesson}`

                //i've got everything here now - how do I send this to /lesson/[id]?
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
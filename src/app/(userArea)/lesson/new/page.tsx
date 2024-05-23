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
    const usp = useSearchParams();
    useEffect(() => {
        async function main() {
            const givenQ = usp.get('q');
            const givenUkP = usp.get('ukp');
            console.log("Creating GET request to /api/lessons/new")
            try {
                // const response = await axios.get(`/api/lessons/new`, {
                //     params: {
                //         mode: givenQ ? 'New Question' : 'Free Roam',
                //         content: givenQ ? givenQ : givenUkP
                //     }
                // })
                // const lessID = response.data.id;
                // if (!lessID) return { status: 500 };
                // console.log("Response from /api/lessons/new: ", response)
                // const parseResult = z.string().regex(/[0-9A-z]+/).safeParse(lessID)

                // if (!parseResult.success) {
                //     console.log("Failed to parse response from /api/lessons/new: ", parseResult.error.message)
                //     return { status: 500 };
                // }
                // console.log("Successfully receieved & parsed lesson: ", lessID);
                // window.location.href = `/lesson/${lessID}&initiate=true`
                //await a mock promsie of 2s
                await new Promise((res) => setTimeout(res, 2000));
                window.location.href = `/lesson/mock&initiate=true`
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
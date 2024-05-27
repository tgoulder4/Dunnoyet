'use client'
import { getLoggedInUser } from '@/app/api/[[...route]]/auth';
import { createLesson, getLesson } from '@/app/api/[[...route]]/lessons';
import Lesson from '@/components/UserArea/Learn/Lesson/Lesson';
import { lessonStatePayloadSchema } from '@/lib/validation/transfer/transferSchemas';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import axios from 'axios';
import { client } from '@/lib/db/hono';
import { z } from 'zod';
// import { AppTypes } from '@/app/api/[[...route]]/route';
// import { hc } from 'hono/client';
// const client = hc<AppTypes['lessonRoute']>('');
var equal = require('deep-equal');
function usePayload() {
    const usp = useSearchParams();
    useEffect(() => {
        async function main() {
            const givenQ = usp.get('q');
            const givenUkP = usp.get('uKP');
            if (!givenQ && !givenUkP) {
                console.error("No question or ukp given")
                return { status: 500 };
            }
            console.log("Creating GET request to /api/lessons/new")
            try {
                // //prod
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
                // window.location.href = `/lesson/${lessID}`

                //mock
                await new Promise((res) => setTimeout(res, 2000));
                window.location.href = `/lesson/mock`
            }
            catch (e) {
                console.error(e)
            }
        }
        main()
    }, [])
}
function page() {
    const payload = useRef(usePayload());
    return (<Lesson payload={{ stage: "loading", lastSaved: new Date }} />)
}

export default page
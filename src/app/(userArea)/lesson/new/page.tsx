'use server'
// import { getLoggedInUser } from '@/app/api/[[...route]]/auth';

import Lesson from '@/components/UserArea/Learn/Lesson/Lesson';
import { lessonStatePayloadSchema } from '@/lib/validation/transfer/transferSchemas';
import { redirect, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import axios from 'axios';
import { client } from '@/lib/db/hono';
import { z } from 'zod';
import { isProd } from '@/lib/constants';
import { createLesson } from '../[lessonId]/actions';
// import { AppTypes } from '@/app/api/[[...route]]/route';
// import { hc } from 'hono/client';
// const client = hc<AppTypes['lessonRoute']>('');
var equal = require('deep-equal');
async function Page({ searchParams, params }: {
    searchParams: { [key: string]: string | string[] | undefined },
    params: { slug: string }
}) {
    // const usp = useSearchParams();
    //double renders in react strictmode exhausting api calls. this is a workaround

    const givenQ = searchParams.q;
    const givenUkP = searchParams.uKP;
    if (!givenQ && !givenUkP) {
        console.error("No question or ukp given")
        return { status: 500 };
    }
    console.log("Creating GET request to /api/lessons/new")
    // try {
    if (isProd) {
        const less = await createLesson('65dbe7799c9c2a30ecbe6193', {
            mode: givenQ ? 'New Question' : 'Free Roam',
            content: givenQ ? givenQ as string : givenUkP as string
        })

        // const lessID = response.data.id;
        // if (!lessID) return { status: 500 };
        // console.log("Response from /api/lessons/new: ", response)
        // const parseResult = z.string().regex(/[0-9A-z]+/).safeParse(lessID)

        // if (!parseResult.success) {
        //     console.log("Failed to parse response from /api/lessons/new: ", parseResult.error.message)
        //     return { status: 500 };
        // }
        // console.log("Successfully receieved & parsed lesson: ", lessID);
        redirect(`/lesson/${less?.id}`)
        // window.location.href = `/lesson/${lessID}`
    } else {
        await new Promise((res) => setTimeout(res, 2000));
        // window.location.href = `/lesson/mock`
    }
    // }
    // catch (e) {
    //     console.error(e)
    //     redirect(`/api/error&err=500`)
    //     // window.location.href = "/api/error&err=500"
    // }

    // useEffect(() => {
    //     async function main() {
    //         if (!initialized.current) {
    //             initialized.current = true;
    //             const givenQ = searchParams.q;
    //             const givenUkP = searchParams.uKP;
    //             if (!givenQ && !givenUkP) {
    //                 console.error("No question or ukp given")
    //                 return { status: 500 };
    //             }
    //             console.log("Creating GET request to /api/lessons/new")
    //             try {
    //                 if (isProd) {
    //                     const response = await axios.get(`/api/lessons/new`, {
    //                         params: {
    //                             mode: givenQ ? 'New Question' : 'Free Roam',
    //                             content: givenQ ? givenQ : givenUkP
    //                         }
    //                     })
    //                     const lessID = response.data.id;
    //                     if (!lessID) return { status: 500 };
    //                     console.log("Response from /api/lessons/new: ", response)
    //                     const parseResult = z.string().regex(/[0-9A-z]+/).safeParse(lessID)

    //                     if (!parseResult.success) {
    //                         console.log("Failed to parse response from /api/lessons/new: ", parseResult.error.message)
    //                         return { status: 500 };
    //                     }
    //                     console.log("Successfully receieved & parsed lesson: ", lessID);
    //                     redirect(`/lesson/${lessID}`)
    //                     // window.location.href = `/lesson/${lessID}`
    //                 } else {
    //                     await new Promise((res) => setTimeout(res, 2000));
    //                     // window.location.href = `/lesson/mock`
    //                 }
    //             }
    //             catch (e) {
    //                 console.error(e)
    //                 window.location.href = "/api/error&err=500"
    //             }
    //         }
    //     }
    //     main()
    // })
    return (
        <>
            <title>Creating Lesson - Dunnoyet</title>
            <Lesson payload={{ stage: "loading", lastSaved: new Date }} /></>)
}

export default Page
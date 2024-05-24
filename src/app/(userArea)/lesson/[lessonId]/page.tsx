'use server'
import { getLoggedInUser } from '@/app/api/[[...route]]/auth';
import { getLesson } from '@/app/api/[[...route]]/lessons'
import Lesson from '@/components/UserArea/Learn/Lesson/Lesson';
import { lessonSchema } from '@/lib/validation/general/types';
import { lessonStatePayloadSchema, messagesPayloadSchema } from '@/lib/validation/transfer/transferSchemas';
import { useSearchParams } from 'next/navigation';
import { NextResponse } from 'next/server';
import React from 'react'
import { z } from 'zod';

async function LessonPage({ params, searchParams }: { params: { lessonId: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
    const lessonId = params.lessonId;
    const lesson = await getLesson(lessonId);
    console.log("GetLesson response: ", lesson)
    if (!lesson) {
        // return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL! + "/api/error") 
        return <>Error</>
    };
    const {
        stage,
        targetQ,
        beganAt,
        subject,
        messages,
        userId
    } = lesson;
    const payload: z.infer<typeof lessonStatePayloadSchema> = {
        lastSaved: beganAt,
        stage,
        subject: subject || undefined,
        targetQuestion: targetQ || undefined,
        newMessages: messages ? messages : [] as any,
        lessonID: lessonId,
        userID: userId
    }
    console.log("LessonPage payload: ", payload)
    return (
        <Lesson payload={
            payload
            // //for new question testing
            // //     {
            // //     lastSaved: new Date(),
            // //     stage: 'purgatory',
            // //     subject: undefined,
            // //     targetQuestion: {
            // //         point: 'What is the spinal cavity?',
            // //         TwoDvK: []
            // //     },
            // //     newMessages: [
            // //         {
            // //             role: 'eli',
            // //             content: 'Tell me a fact you understand within this topic!',
            // //             eliResponseType: 'WhatComesToMind',
            // //             distanceAwayFromFinishingLesson: 10,
            // //         },
            // //         // {
            // //         //     role: 'user',
            // //         //     content: 'Some user reply',
            // //         // },
            // //     ],
            // // }
            // //for free roam testing
            // {
            //     subject: 'Spinal Cord',
            //     lastSaved: new Date(),
            //     // //was right
            //     // stage: 'main',
            //     // newMessages: [{
            //     //     role: 'user', content: 'The spinal cavity holds the spinal cord',
            //     //     KP: {
            //     //         confidence: 2,
            //     //         KP: 'The spinal cavity holds the spinal cord',
            //     //         TwoDvK: [80.73157922699662, 0.399578771299815]
            //     //     }
            //     // },
            //     // {
            //     //     role: 'eli',
            //     //     content: 'which is protected by the vertebrae bones',
            //     //     eliResponseType: "General",
            //     //     KP: {
            //     //         confidence: 1,
            //     //         KP: 'The vertebrae bones protect the spinal cord in the spine.',
            //     //         TwoDvK: [2.73157922699662, 42.399578771299815]
            //     //     }
            //     // }]
            //     //was wrong
            //     stage: 'purgatory',
            //     newMessages: [{
            //         role: 'user', content: 'The spinal cavity doesn\'t hold the spinal cord'
            //     },
            //     {
            //         role: 'eli',
            //         content: 'That wasn\'t quite right. What\'s a different fact you\'ve got?',
            //         eliResponseType: "WhatComesToMind"
            //     }]
            // }

        } />
    )
}

export default LessonPage
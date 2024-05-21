'use server'
import { getLoggedInUser } from '@/app/api/[[...route]]/auth';
import { getLesson, initiateLesson } from '@/app/api/[[...route]]/lessons'
import Lesson from '@/components/UserArea/Learn/Lesson/Lesson';
import { lessonSchema } from '@/lib/validation/general/types';
import { lessonStatePayloadSchema, messagesPayloadSchema } from '@/lib/validation/transfer/transferSchemas';
import { useSearchParams } from 'next/navigation';
import React from 'react'
import { z } from 'zod';

async function LessonPage({ params, searchParams }: { params: { id: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
    // const lesson = await getLesson("664cdadd149022456b034b4f");
    // if (!lesson) return { status: 401 };
    // const {
    //     stage,
    //     targetQ,
    //     beganAt,
    //     subject,
    //     messages
    // } = lesson;
    // const payload: z.infer<typeof lessonStatePayloadSchema> = {
    //     lastSaved: beganAt,
    //     stage,
    //     subject: subject || undefined,
    //     targetQuestion: targetQ || undefined,
    //     newMessages: messages ? messages : [] as any,
    //     lessonID: params.id
    // }
    // console.log("LessonPage payload: ", payload)
    return (
        <Lesson payload={{
            lastSaved: new Date(),
            stage: 'purgatory',
            subject: undefined,
            targetQuestion: {
                point: 'What is the spinal cavity?',
                TwoDvK: []
            },
            newMessages: [
                {
                    role: 'eli',
                    content: 'Tell me a fact you understand within this topic!',
                    eliResponseType: 'WhatComesToMind',
                    distanceAwayFromFinishingLesson: 10,
                },
                // {
                //     role: 'user',
                //     content: 'Some user reply',
                // },
            ],
        }} />
    )
}

export default LessonPage
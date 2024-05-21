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
    const lesson = await getLesson("664cdadd149022456b034b4f");
    if (!lesson) return { status: 401 };
    //get the url query 'initiate'
    // let lesson: z.infer<typeof lessonStatePayloadSchema> = {} as any;
    // if (searchParams?.initiate){
    //     lesson = await initiateLesson(params.id)
    // }else{
    //     const less = await getLesson(params.id);
    //     if (!less) return { status: 401 };
    //     lesson = less;
    // }
    // if (!lesson) return { status: 401 };
    const {
        stage,
        targetQ,
        beganAt,
        subject,
        messages
    } = lesson;
    const payload: z.infer<typeof lessonStatePayloadSchema> = {
        lastSaved: beganAt,
        stage,
        subject: subject || undefined,
        targetQuestion: targetQ || undefined,
        newMessages: messages ? messages : [] as any,
        lessonID: params.id
    }
    console.log("LessonPage payload: ", payload)
    return (
        <Lesson payload={payload} />
    )
}

export default LessonPage
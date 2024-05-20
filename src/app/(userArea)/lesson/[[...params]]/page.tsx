'use server'
import { getLoggedInUser } from '@/app/api/[[...route]]/auth';
import { getLesson } from '@/app/api/[[...route]]/lessons'
import Lesson from '@/components/UserArea/Learn/Lesson/Lesson';
import { lessonStatePayloadSchema } from '@/lib/validation/transfer/transferSchemas';
import { useSearchParams } from 'next/navigation';
import React from 'react'
import { z } from 'zod';

async function LessonPage({ params }: { params: { id: string } }) {
    //if there's no '&nofetch' in the url, get the lesson
    const user = getLoggedInUser();
    if (!user) return { status: 401 };
    // const lesson = await getLesson(params.id);
    if (!lesson) return { status: 401 };
    const {
        stage,
        targetQ,
        beganAt,
        messages
    } = lesson;
    const payload: z.infer<typeof lessonStatePayloadSchema> = {
        lastSaved: beganAt,
        stage,
        targetQuestion: targetQ,
        newMessages: messages ? messages : [] as any,
        lessonID: params.id
    }
    return (
        <Lesson payload={payload} />
    )
}

export default LessonPage
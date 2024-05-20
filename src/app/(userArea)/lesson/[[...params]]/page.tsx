'use server'
import { getLoggedInUser } from '@/app/api/[[...route]]/auth';
import { getLesson } from '@/app/api/[[...route]]/lessons'
import Lesson from '@/components/UserArea/Learn/Lesson/Lesson';
import { useSearchParams } from 'next/navigation';
import React from 'react'

async function LessonPage({ params }: { params: { id: string } }) {
    //if there's no '&nofetch' in the url, get the lesson
    const user = getLoggedInUser();
    if (!user) return { status: 401 };
    const lesson = await getLesson(params.id);
    if (!lesson) return { status: 401 };

    const usp = useSearchParams();
    const performFetch = usp.get('nofetch');
    if (performFetch) {
        const lesson = await getLesson(params.id)
        // const lesson = await res.json(); //if client component, change to lessonStateSchema.safeparse(await res.json())
    }
    return (
        <Lesson payload={{ stage: "loading", lastSaved: new Date }} />
    )
}

export default LessonPage
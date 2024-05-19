'use server'
import { getLoggedInUser } from '@/app/api/[[...route]]/auth';
import { getLesson } from '@/app/api/[[...route]]/lessons'
import React from 'react'

export async function LessonPage({ params }: { params: { id: string } }) {
    //if there's no '&nofetch' in the url, get the lesson
    const lesson = await getLesson(params.id);
    const user = await getLoggedInUser();
    if (!user || !user.id || !lesson) return { status: 401 };
    return (
        <div>LessonPage</div>
    )
}

export default LessonPage
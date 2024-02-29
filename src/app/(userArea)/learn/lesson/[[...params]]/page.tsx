'use server'
import { getLesson } from '@/app/api/lessons/route'
import { merriweather } from '@/app/fonts'
import ChatWithEli from '@/components/UserArea/Learn/ChatWithEli'
import Lesson from '@/components/UserArea/Learn/Lesson/Lesson'
import { responsiveFont, sizing, spacing } from '@/lib/constants'
import { ILesson } from '@/lib/validation/enforceTypes'
import { redirect } from 'next/navigation'
import React from 'react'
var equal = require('deep-equal');
export default async function LessonLoader({ params }: { params: any }) {
    const passedParams = params.params;
    console.log("LESSON PAGE params", passedParams);
    if (passedParams == 0 || equal(params, {})) redirect('/api/error');
    const lessonID = passedParams[0];
    if (!lessonID) throw new Error("LessonID was undefined. params was: " + JSON.stringify(params) + " and passedParams was: " + JSON.stringify(passedParams));
    const lesson = await getLesson(lessonID);
    if (!lesson) redirect('/learn');
    if (!lesson.)
        return (<Lesson initialLessonState={lesson} />)
}

'use server'
import { getLesson } from '@/app/api/lessons/route'
import { merriweather } from '@/app/fonts'
import { auth } from '@/auth'
import ChatWithEli from '@/components/UserArea/Learn/Chat/ChatWithEli'
import Lesson from '@/components/UserArea/Learn/Lesson/Lesson'
import { responsiveFont, sizing, spacing } from '@/lib/constants'
import prisma from '@/lib/db/prisma'
import { IKnowledge, ILesson, ILessonState, IMessage, IMetadata } from '@/lib/validation/enforceTypes'
import { redirect } from 'next/navigation'
import React from 'react'
import { useSearchParams } from 'next/navigation'
var equal = require('deep-equal');
async function getLessonState(lessonID: string, userID: string): Promise<ILessonState | null> {
    console.log("getLessonState called with lessonID: ", lessonID)
    try {
        const lesson = await prisma.lesson.findFirst({
            where: {
                id: lessonID,
                userId: userID
            }
        })
        if (!lesson) throw new Error("Prisma didn't return a lesson @getLessonState")
        const result = await prisma.lessonState.findFirst({
            //also get the lesson from this and check if the lesson's userID matches the userID
            where: {
                id: lesson.stateId,
                Lesson: {
                    userId: userID
                }
            },
            include: {
                metadata: {
                    include: {
                        knowledgePointChain: true,
                    }
                },
                messages: true,

            }
        })
        console.log("lesson loader found lesson state: ", result)
        if (!result) throw new Error("Prisma didn't return a lesson state @getLessonState")
        const { messages, metadata } = result;
        if (!messages) throw new Error("Prisma didn't return messages @getLessonState")
        if (!metadata) throw new Error("Prisma didn't return metadata @getLessonState")
        //threads is 2D so we need to parse it from JSON (prisma doesn't support 2D arrays so it stores it as a JSON)

        const metadataForLessonState: IMetadata = {
            knowledgePointChain: metadata.knowledgePointChain,
            subjects: metadata.subjects,
            currentKnowledgePointIndex: metadata.currentKnowledgePointIndex,
            //convert threads from JSON to 2D array
            threads: metadata.threads as IMessage[][],
            lessonID: lesson.id,
        }
        const lessonState: ILessonState = {
            messages: messages as IMessage[],
            metadata: metadataForLessonState
        }
        console.log("[getLessonState] returning lessonState: ", lessonState)
        return lessonState;
    }
    catch (error) {
        console.error("Error in getLessonState: ", error)
        return null;
    }
}
export default async function LessonLoader({ params }: { params: any }) {
    const sess = await auth();
    if (!sess) throw new Error("UNAUTHORIZED @LessonLoader");
    const userID = sess.user?.id;
    if (!userID) throw new Error("UNAUTHORIZED @LessonLoader2");
    const passedParams = params.params;
    console.log("LESSON PAGE params", passedParams);
    if (passedParams == 0 || equal(params, {})) redirect('/api/error');
    const lessonID = passedParams[0];
    if (!lessonID) throw new Error("LessonID was undefined. params was: " + JSON.stringify(params) + " and passedParams was: " + JSON.stringify(passedParams));
    const initialLessonState: ILessonState | null = await getLessonState(lessonID, userID);
    if (!initialLessonState) throw new Error("No initial lesson state found, couldn't load lesson page");
    return (<Lesson initialLessonState={initialLessonState} />)
}

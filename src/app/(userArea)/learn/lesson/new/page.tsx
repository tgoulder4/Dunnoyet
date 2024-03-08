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
export default async function LessonLoader({ params }: { params: any }) {
    const sess = await auth();
    if (!sess) throw new Error("UNAUTHORIZED @LessonLoader");
    const userID = sess.user?.id;
    if (!userID) throw new Error("UNAUTHORIZED @LessonLoader2");
    return (<Lesson initialLessonState={{
        oldMessages: [],
        newMessages: [],
        metadata: {
            metadataId: "0",
            lessonID: "0",
            threads: [],
            subjects: [],
            knowledgePointChain: [],
            currentKnowledgePointIndex: 0,
        }
    }} />)
}

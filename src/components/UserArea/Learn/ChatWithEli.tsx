'use client'
import { getEmbeddingForKnowledgeBase } from '@/app/(userArea)/learn/pineconeActions'
import { IMessage } from '@/lib/validation/enforceTypes'
import React, { use, useEffect, useState } from 'react'
import Conversation from './Conversation'
import { useSession } from 'next-auth/react'
import { ILesson } from '@/lib/validation/enforceTypes'
type chatProps = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    lessonID: string,
    lessons: ILesson[] | null
}
function ChatWithEli({
    isOpen,
    setIsOpen,
    lessonID, lessons
}: chatProps) {
    const [lessonInProgress, setLessonInProgress] = useState<ILesson | null>(null);
    const [subject, setSubject] = useState('');
    const {
        id,
        name,
        tutorName
    } = useSession().data?.user!!;
    useEffect(() => {
        if (lessonID == "Tutorial" || lessons == null) {
            setSubject("Welcome");
        }
        else {
            const lesson = lessons.find((lesson) => lesson.id === lessonID);
            if (!lesson) {
                console.error("Entered LessonID not found in lessons list @chatWithEli. lessonID: ", lessonID, " lessons: ", lessons)
                return;
            }
            setLessonInProgress(lesson);
        }
    }
        , [lessonID, lessons]);
    return (<div className='flex flex-col bottom-0 right-0 z-10 w-full max-w-[500px] fixed rounded-t-[10px]'>
        <div className='p-8 bg-white'>{subject}</div>
        {
            isOpen ? <Conversation />
                : null
        }
    </div>
    )
}

export default ChatWithEli
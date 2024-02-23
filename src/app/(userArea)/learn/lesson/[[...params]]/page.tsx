import ChatWithEli from '@/components/UserArea/Learn/ChatWithEli'
import NeuralNetwork from '@/components/UserArea/Learn/Lesson/NeuralNetwork'
import { ILesson } from '@/lib/validation/enforceTypes'
import React from 'react'

export async function LessonPage({ params }: { params: { lessonID: string } }) {
    const Lesson: ILesson = await getLesson(lessonID)
    return (<>
        <div>LessonPage</div>
        <NeuralNetwork />
        <ChatWithEli />
    </>
    )
}

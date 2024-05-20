'use client'
import React, { useState } from 'react'
import LessonSection from './LessonSection';
import LearningPathItem from './LearningPathItem';
import LearningPathItemTitle from './LearningPathItemTitle';
import Brainmap from './BrainMap/Brainmap';
import { spacing, uiBorder } from '@/lib/constants';
import { messagesPayloadSchema } from '@/lib/validation/transfer/transferSchemas';
import CreatingLesson from './Loading/CreatingLesson';
import { useSession } from 'next-auth/react';

function Lesson({ payload }: { payload: any }) {
    const lessonXPadding: string = 'clamp(24px,4vw,400px)';
    const [messageHistory, setMessageHistory] = useState([]);
    const parsed = messagesPayloadSchema.safeParse(payload);
    if (!parsed.success) {
        console.error("Invalid format, failed parse IF@LSK: ", payload, " error: ", parsed.error)
        parsed.error
        return <></>
    }
    console.log("PARSE PASSED: ", payload)
    const {
        stage,
        lastSaved,
        newMessages,
        targetQuestion
    } = parsed.data;
    return (
        <div className="flex h-full">
            <div className="flex flex-[3] flex-col" style={{ borderRight: uiBorder(0.1) }}>
                <LessonSection style={{ paddingLeft: lessonXPadding, borderBottom: uiBorder(0.1) }} className='learningPath flex flex-col gap-3 flex-[3]'>
                    <LearningPathItem confidence={1} text='Placeholder' />
                    <LearningPathItem confidence={1} text='Placeholder' />
                    <LearningPathItem confidence={1} text='Placeholder' />
                </LessonSection>
                <LessonSection style={{ paddingLeft: lessonXPadding, paddingBottom: 2 * spacing.gaps.largest }} className='brainMap flex-[2]'>
                    <Brainmap placeholderMode={true} />
                </LessonSection>
            </div>
            <LessonSection className='flex-[5] learningChatArea' style={{ borderRight: uiBorder(0.1) }}>
                {stage == 'loading' && <CreatingLesson />}
            </LessonSection>
            <LessonSection style={{ paddingRight: lessonXPadding }} className='flex-[2] notesArea'>
                <Brainmap placeholderMode={true} />

            </LessonSection>
        </div>
    )
}

export default Lesson
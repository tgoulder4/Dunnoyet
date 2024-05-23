'use client'
import React, { useEffect, useState } from 'react'
import LessonSection from './LessonSection';
import LearningPathItem from './LearningPathItem';
import LearningPathItemTitle from './LearningPathItemTitle';
import Brainmap from './BrainMap/Brainmap';
import { lessonPaddingBottom, spacing, uiBorder } from '@/lib/constants';
import { messagesPayloadSchema } from '@/lib/validation/transfer/transferSchemas';
import CreatingLesson from './Loading/CreatingLesson';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import Chat from './Chat/Chat';
import { messagesSchema } from '@/lib/validation/primitives';
import Notes from './Notes/Notes';

function Lesson({ payload }: { payload: z.infer<typeof messagesPayloadSchema> }) {
    console.log("Payload received: ", payload)
    const lessonXPadding: string = 'clamp(24px,4vw,400px)';
    const parsed = messagesPayloadSchema.safeParse(payload);
    if (!parsed.success) {
        console.error("Invalid format, failed parse IF@LSK: ", payload, " error: ", parsed.error)
        parsed.error
        return <></>
    }
    const {
        stage,
        lastSaved,
        newMessages,
        targetQuestion,
        subject
    } = parsed.data;
    const [messageHistory, setMessageHistory] = useState(newMessages as z.infer<typeof messagesSchema>[]);
    const [distanceUntilLessonEnd, setDistanceUntilLessonEnd] = useState(findDistanceUntilLessonEnd(newMessages || []));
    const [KPs, setKPs] = useState(messageHistory ? messageHistory.filter(msg => msg.KP != undefined).map(msg => msg.KP!) : [])
    console.log("KPs in lesson: ", KPs)
    function findDistanceUntilLessonEnd(messages: z.infer<typeof messagesSchema>[]): number {
        if (messages.length == 0) return -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            const dist = messages[i].distanceAwayFromFinishingLesson;
            if (dist) {
                return dist;
            }
        }
        return -1;
    }
    return (
        <div className="flex h-full font-bold">
            <div className="flex flex-[3] flex-col" style={{ borderRight: uiBorder(0.1) }}>
                <LessonSection style={{ paddingBottom: lessonPaddingBottom, paddingLeft: lessonXPadding, borderBottom: uiBorder(0.1) }} className='learningPath flex flex-col gap-3 flex-[3]'>
                    {/* for each of the messages sent by eli */}
                    {
                        stage == 'loading' ?
                            <>
                                <LearningPathItem confidence={1} text="Placeholder" />
                                <LearningPathItem confidence={1} text="Placeholder" />
                                <LearningPathItem confidence={1} text="Placeholder" />
                            </> : stage !== "purgatory" && <>
                                {messageHistory.map((msg, index) => {
                                    //if there's a kp, show it. last one is current
                                    if (msg.KP) {
                                        return <LearningPathItem key={msg.KP.KP + index} lastItem={index + 2 > messageHistory.length} confidence={msg.KP.confidence!} text={msg.KP.KP!} />
                                    }
                                })}
                                {

                                    targetQuestion ?
                                        <>
                                            <LearningPathItem confidence={0} text={"About " + distanceUntilLessonEnd + " more"} />
                                            <LearningPathItem confidence={0} lastItem={true} text={"Finish 🏁"} />
                                        </> : <></>
                                }

                            </>
                    }
                </LessonSection>
                <LessonSection style={{ paddingLeft: lessonXPadding, paddingBottom: lessonPaddingBottom }} className='brainMap flex-[3]'>
                    {stage == 'loading' ?
                        <Brainmap placeholderMode={true} />
                        : stage !== "purgatory" &&
                        <Brainmap KPsToFocus={KPs} />
                    }
                </LessonSection>
            </div>
            <LessonSection className='flex-[5] learningChatArea h-full' style={{ padding: 0, borderRight: uiBorder(0.1) }}>
                {stage == 'loading' ? <CreatingLesson /> : <Chat distanceUntilLessonEnd={distanceUntilLessonEnd} messages={messageHistory} subject={subject} targetQContent={targetQuestion?.point} />}
            </LessonSection>
            <LessonSection style={{ paddingRight: lessonXPadding, paddingBottom: 0 }} className='flex-[2] notesArea h-full'>
                {stage == 'loading' ? <Notes placeholderMode={true} /> : stage !== "purgatory" && <Notes />}
            </LessonSection>
        </div>
    )
}

export default Lesson
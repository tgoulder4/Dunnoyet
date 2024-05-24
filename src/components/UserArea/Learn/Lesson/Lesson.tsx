'use client'
import React, { useEffect, useRef, useState } from 'react'
import LessonSection from './LessonSection';
import LearningPathItem from './LearningPathItem';
import LearningPathItemTitle from './LearningPathItemTitle';
import Brainmap from './BrainMap/Brainmap';
import { lessonPaddingBottom, lessonXPadding, spacing, uiBorder } from '@/lib/constants';
import { lessonStatePayloadSchema, lessonStateSchema, messagesPayloadSchema, messagesReceiveSchema } from '@/lib/validation/transfer/transferSchemas';
import CreatingLesson from './Loading/CreatingLesson';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import Chat from './Chat/Chat';
import { messagesSchema } from '@/lib/validation/primitives';
import Notes from './Notes/Notes';
import { toast } from 'sonner';
import { findDistanceUntilLessonEnd } from './Chat/Helpers';

function Lesson({ payload }: { payload: z.infer<typeof lessonStatePayloadSchema> }) {
    // const user = useSession().data?.user!
    // session is always non-null inside this page, all the way down the React tree.
    console.log("Payload received: ", payload)
    const [currentLessonState, setCurrentLessonState] = useState({
        ...payload,
        msgHistory: payload.newMessages, //contains the KPs
    } as z.infer<typeof lessonStateSchema>);
    const {
        stage,
        lastSaved,
        newMessages,
        targetQuestion,
        lessonID,
        userID
    } = currentLessonState;
    if (!stage) {
        //missing stage in lesson payload
        toast.error("An error occurred: MSILP@Lesson")
        return <></>
    }
    if (!lastSaved || !newMessages || !lessonID || !userID) {
        //missing info in lesson payload
        toast.error("Something went wrong: MIILP@Lesson")
    }
    const subject = useRef<string | undefined>(payload.subject);
    return (
        <div className="flex h-full font-bold">
            <div className="flex flex-[3] flex-col" style={{ borderRight: uiBorder(0.1) }}>
                <LessonSection style={{ paddingBottom: lessonPaddingBottom, paddingLeft: lessonXPadding, borderBottom: uiBorder(0.1) }} className='transition-all learningPath flex flex-col gap-3 flex-[3]'>
                    {/* for each of the messages sent by eli */}
                    {
                        stage == 'loading' ?
                            <>
                                <LearningPathItem confidence={1} text="Placeholder" />
                                <LearningPathItem confidence={1} text="Placeholder" />
                                <LearningPathItem confidence={1} text="Placeholder" />
                            </> : stage !== "purgatory" && <>
                                {currentLessonState.msgHistory.map((msg, index) => {
                                    //if there's a kp, show it. last one is current
                                    if (msg.KP) {
                                        return <LearningPathItem key={msg.KP.KP + index} lastItem={index + 2 > currentLessonState.msgHistory.length} confidence={msg.KP.confidence!} text={msg.KP.KP!} />
                                    }
                                })}
                                {

                                    targetQuestion ?
                                        <>
                                            <LearningPathItem confidence={0} text={"About " + findDistanceUntilLessonEnd(currentLessonState.msgHistory) + " more"} />
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
                        <Brainmap KPsToFocus={currentLessonState.msgHistory ? currentLessonState.msgHistory.filter(msg => msg.KP != undefined).map(msg => msg.KP!) : []} />
                    }
                </LessonSection>
            </div>
            <LessonSection className='flex-[5] learningChatArea h-full' style={{ padding: 0, borderRight: uiBorder(0.1) }}>
                {stage == 'loading' ? <CreatingLesson /> : <Chat lessonState={currentLessonState} setLessonState={setCurrentLessonState} subject={subject.current} targetQContent={targetQuestion?.point} />}
            </LessonSection>
            <LessonSection style={{ paddingRight: lessonXPadding, paddingBottom: 0 }} className='flex-[2] notesArea h-full'>
                {stage == 'loading' ? <Notes placeholderMode={true} /> : stage !== "purgatory" && <Notes />}
            </LessonSection>
        </div>
    )
}

export default Lesson
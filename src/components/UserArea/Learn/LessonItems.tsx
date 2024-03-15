import React, { useContext, useEffect, useState } from 'react'
import NextAuth from 'next-auth/react'
import getServerSession, { Session } from 'next-auth';
import { authConfig } from '@/auth.config';
import { spacing } from '@/lib/constants';
import LessonItem from './LessonItem';
import { ILesson } from '@/lib/validation/enforceTypes';
import { useSession } from 'next-auth/react';

export default function LessonItems({ tutorialMode, lessons }: { tutorialMode: boolean, lessons: ILesson[] | null }) {
    const sess = useSession();
    const userID = sess.data?.user?.id!!;

    // useEffect(() => {
    //     console.log("sess: ", sess)
    // }, [sess]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3" style={{ gap: spacing.gaps.groupedElement }}>
            {
                lessons === null ? <> <LessonItem loading={true} /> <LessonItem loading={true} /><LessonItem loading={true} /></> : lessons.length > 0 ?
                    lessons.map((item) => {

                        return <LessonItem imageURL="https://cdn.discordapp.com/attachments/917525824956158012/1206262827254546452/image.png?ex=65f70e4d&is=65e4994d&hm=b5ed7bc6840ebdb6be4af51302a2c31dd640e223a8b73e9ac8aeaa39c083a507&" key={item.id} lessonID={item.id} subject={'TOFIX' || item.messages?.[0].content as string || "Couldn't load title."} currentKnowledgeSummary={item.lessonState.metadata.knowledgePointChain?.[item.lessonState.metadata.knowledgePointChain.length - 1]?.pointInSolitude || "Couldn't load description."} />
                    }) : <LessonItem tutorialMode={tutorialMode} zeroLessons={true} />
            }
        </div>
    );
}

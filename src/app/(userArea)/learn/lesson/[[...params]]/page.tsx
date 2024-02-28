'use client'
import { merriweather } from '@/app/fonts'
import ChatWithEli from '@/components/UserArea/Learn/ChatWithEli'
import NeuralNetwork from '@/components/UserArea/Learn/Lesson/NeuralNetwork'
import { responsiveFont, sizing, spacing } from '@/lib/constants'
import { ILesson } from '@/lib/validation/enforceTypes'
import React from 'react'

export default function LessonPage({ params }: { params: { lessonID: string } }) {
    // export type IMessage = {
    //     content: string | ISplitResponse;
    //     eliResponseType?: "General" | "WhatComesToMind" | "ChallengeQ" | 'SubjectIntroduction';
    //     role: "user" | "eli";
    //     placeHolderText?: string;
    // };
    // export type ISplitResponse = { text: string, active: boolean };
    // export type ILesson = {
    //     id: string;
    //     subjects: string[];
    //     messages?: IMessage[];
    //     beganAt: Date;
    //     lessonStatus: "Active" | "Completed";
    //     endedAt: Date;
    //     knowledgePointChain: IKnowledge[];
    // }
    return (<div style={{ paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, paddingTop: spacing.padding.largest }}>
        <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largerFontSize) }}>Vectors: Arrow Representation</h1>
        <NeuralNetwork />
        <ChatWithEli isOpen={true} setIsOpen={() => { }} lessonID='ABC' lessons={[]} />
    </div>
    )
}

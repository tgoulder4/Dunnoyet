'use client'
import { ILessonState, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload } from '@/lib/validation/enforceTypes'
import React, { useState } from 'react'
import { merriweather } from '@/app/fonts'
import ChatWithEli from '@/components/UserArea/Learn/Chat/ChatWithEli'
import { responsiveFont, sizing, spacing } from '@/lib/constants'

import { getNextMessage } from '@/lib/chat/Eli/eli'
import NeuralNetwork from './NeuralNetwork'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'


export default function LessonPage({ initialLessonState }: { initialLessonState: ILessonState }) {
    const [lessonState, setLessonState] = useState<ILessonState>(initialLessonState);
    const currentSubject = initialLessonState.metadata.subjects[initialLessonState.metadata.subjects.length - 1];
    const {
        messages, metadata
    } = lessonState;
    const {
        knowledgePointChain,
    } = metadata;
    // const ems = knowledgePointChain.map(kp => kp.vectorEmbedding);
    // const twoDCoOrds = getTwoDCoOrdinatesOfEmbeddings(ems);
    // const knowledgePointsWithTwoDCoOrds: IKnowledge[] = knowledgePointChain.map((kp, index) => {
    //     return { ...kp, TwoDCoOrdinates: twoDCoOrds[index] };
    // })
    async function updateState(formData: FormData) {
        //update state
        console.log("UpdateState called with formData: ", formData)
        const theirReply = formData.get("userInput") as string;
        if (!theirReply) {
            console.error("No user input found in form data");
            return null;
        };
        const payload: IMessagesEndpointSendPayload = {
            messages: [...messages, { content: theirReply, role: "user" }],
            metadata
        }
        const nextState: IMessagesEndpointResponsePayload | string = await getNextMessage(payload);
        let error = "";
        if (typeof nextState === "string") { error = nextState } else {
            console.log("nextState: ", nextState)
            const { newMessages, metadata } = nextState;
            setLessonState({ messages: [...lessonState.messages, ...newMessages], metadata });
        };

    }
    console.log("knowledgePointChain (passing to neural network): ", knowledgePointChain)
    console.log("rendering LessonPage with messages: ", messages, " and metadata: ", metadata, " and currentSubject: ", currentSubject, " and knowledgePoints: ")
    console.dir(knowledgePointChain, { depth: null })
    return (<>
        <MainAreaNavbar style='lesson' />
        <div className='h-full flex flex-col' style={{ rowGap: spacing.gaps.groupedElement, paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, paddingTop: spacing.padding.largest }}>
            <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largerFontSize) }}>{currentSubject || "New Question"}</h1>
            <NeuralNetwork knowledgePoints={knowledgePointChain} />
        </div>
        <ChatWithEli isOpen={true} type='Lesson' lessonState={lessonState} updateState={updateState} />
    </>
    )
}
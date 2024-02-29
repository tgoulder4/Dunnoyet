'use client'
import { ILesson, ILessonState, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload } from '@/lib/validation/enforceTypes'
import React, { useState } from 'react'
import { merriweather } from '@/app/fonts'
import ChatWithEli from '@/components/UserArea/Learn/ChatWithEli'
import { responsiveFont, sizing, spacing } from '@/lib/constants'
import { colours, changeColour } from '@/lib/constants'
import { getNextMessage } from '@/lib/chat/Eli/eli'
var equal = require('deep-equal');
export default function LessonPage({ initialLessonState }: { initialLessonState: ILessonState }) {
    if (!initialLessonState) throw new Error("No initial lesson state found, couldn't load lesson page")
    const currentSubject = initialLessonState.metadata.subjects[initialLessonState.metadata.subjects.length - 1];
    const {
        messages, metadata
    } = initialLessonState;
    const {
        knowledgePointChain,
    } = metadata;
    async function updateState(formData: FormData) {
        //update state
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
            const { newMessages } = nextState;
        };

    }
    return (<>
        <div className='h-full flex flex-col' style={{ rowGap: spacing.gaps.groupedElement, paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, paddingTop: spacing.padding.largest }}>
            <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largerFontSize) }}>{currentSubject || "New Question"}</h1>
            <div className="" style={{ paddingRight: sizing.variableWholePagePadding }}>
                <div className='w-full h-full rounded-[20px] border-2' style={{ borderColor: colours.complementary_lighter, backgroundColor: changeColour(colours.complementary_lightest).lighten(5).toString() }}>
                    <canvas></canvas>
                </div>
            </div>
        </div>
        <ChatWithEli isOpen={true} messages={messages} updateState={updateState} />
    </>
    )
}
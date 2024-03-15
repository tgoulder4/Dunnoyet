'use client'
import { ILessonState, IMessage, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload } from '@/lib/validation/enforceTypes'
import React, { useState } from 'react'
import { merriweather } from '@/app/fonts'
import ChatWithEli from '@/components/UserArea/Learn/Chat/ChatWithEli'
import { responsiveFont, sizing, spacing } from '@/lib/constants'

import { getNextMessage } from '@/lib/chat/Eli/eli'
import NeuralNetwork from './NeuralNetwork'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
import getResponse from '@/lib/chat/Eli/mockResponses'
import { NextResponse } from 'next/server'
import { z } from 'zod'


export default function LessonPage({ initialLessonState }: { initialLessonState: ILessonState }) {
    const [lessonState, setLessonState] = useState<ILessonState>(initialLessonState);
    console.log("LessonState: ", lessonState)
    const currentSubject = lessonState.metadata.subjects[lessonState.metadata.subjects.length - 1];
    const {
        newMessages, metadata,
    } = lessonState;
    const {
        knowledgePointChain,
    } = metadata;


    //TODO: KNOWLEDGEPOINT TOOLTIPS OF POINTSINSOLITUDE. i need a DAMN BREAK
    async function updateState(formData?: FormData, explicitState?: IMessagesEndpointResponsePayload, action?: "UNDERSTOOD" | 'ENDLESSON') {
        try {
            let ls = lessonState;
            if (ls.metadata.errorWithTheirInput) {
                ls.metadata.errorWithTheirInput = "";
            }
            console.log("UpdateState called")
            console.log("UpdateState called with formData: ", formData)
            if (!formData && !explicitState && !action) throw new Error("No data was provided to updateState");
            //if there's an action, use it

            //move mock promises into eli.ts
            if (action) {
                const payload: IMessagesEndpointSendPayload = {
                    messages: [...ls.newMessages], //this has been updated for new and old msgs. They will only say understood if theyre at the last of the new messages.
                    metadata: {
                        ...metadata,
                        action
                    }
                }
                //PROD:
                const _getMessageResponse: Response = await fetch('/api/lessons', {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
                const getMessageResponse = await _getMessageResponse.json();
                // const getMessageResponse: IMessagesEndpointResponsePayload | string = await getResponse('Understood'); //DEV

                if (typeof getMessageResponse === "string") {
                    setLessonState({
                        ...ls, metadata: { ...metadata, errorWithTheirInput: getMessageResponse }
                    }
                    )
                } else {
                    console.log("payloadResponse: ", getMessageResponse)
                    const { newMessages, metadata } = getMessageResponse;
                    console.log("Setting lesson state to lessonstate.msgs and newMessages: ", newMessages)
                    setLessonState({ oldMessages: [...ls.oldMessages, ...ls.newMessages], newMessages, metadata });
                };
                return;
            }
            const theirReply = formData!.get("userInput") as string;
            if (!theirReply) {
                console.error("No user input found in form data");
                return null;
            };
            const theirReplyMsg: IMessage = { content: theirReply, role: "user" };
            //TODO: show the submitting question so the user knows their question is being processed

            //if there is an explicit state, use it
            if (explicitState) {
                console.log("Setting lesson state to explicitState: ", explicitState)
                setLessonState({
                    oldMessages: [...ls.oldMessages, ...ls.newMessages, theirReplyMsg], newMessages: [...explicitState.newMessages],
                    metadata: explicitState.metadata
                });
                return;
            } else {


            }
            //update state with their new reply
            const payload: IMessagesEndpointSendPayload = {
                messages: [...ls.oldMessages, ...ls.newMessages, { content: theirReply, role: "user" }],
                metadata
            }
            console.log("Sending payload to backend: ", payload)
            // const getMessageResponse: IMessagesEndpointResponsePayload | string = await getNextMessage(payload);

            /**
             * _getMessageResponse returns {error:string} | {error:z.ZodIssue[]} | {resp: string | IMessagesEndpointResponsePayload}
             */
            const _getMessageResponse: Response = await fetch('/api/lessons', {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            const getMessageResponse = await _getMessageResponse.json();

            if (getMessageResponse.error) {
                console.error(getMessageResponse.error)
                return;
            } else if (typeof getMessageResponse.resp === "string") {
                return getMessageResponse.resp;
            } else {
                console.log("nextState: ", getMessageResponse)
                const { newMessages, metadata } = getMessageResponse;
                setLessonState({ oldMessages: [...ls.oldMessages, ...ls.newMessages, theirReplyMsg], newMessages, metadata });
            }
        } catch (e) { console.error(e) }

    }
    // console.log("knowledgePointChain (passing to neural network): ", knowledgePointChain)
    // console.log("rendering LessonPage with oldmessages: ", oldMessages, " and metadata: ", metadata, " and currentSubject: ", currentSubject, " and knowledgePoints: ")
    // console.dir(knowledgePointChain, { depth: null })
    return (<>
        <MainAreaNavbar style='lesson' />
        <div className='h-full flex flex-col bg-white' style={{ rowGap: spacing.gaps.groupedElement, paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, paddingTop: spacing.padding.largest, paddingBottom: spacing.padding.largest }}>
            <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largerFontSize) }}>{currentSubject || "New Question"}</h1>
            <NeuralNetwork knowledgePoints={knowledgePointChain} />
        </div>
        <ChatWithEli isOpen={true} type={lessonState.oldMessages.length > 0 ? 'Lesson' : 'NewQ'} lessonState={lessonState} updateState={updateState} />
    </>
    )
}
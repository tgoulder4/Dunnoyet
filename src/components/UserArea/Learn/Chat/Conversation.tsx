import React from 'react'
import { useState } from 'react'
import { IMessage, ILesson, ISplitResponse } from '@/lib/validation/enforceTypes'
import UserMessage from './UserMessage'
import EliMessage from './EliMsg'

function Conversation({ messages }: { messages: IMessage[] }) {
    // const [messages, setMessages] = useState([] as IMessage[] | null)
    return (
        <div>{
            messages.map((message, index) =>
                message.role === "user" ? <UserMessage text={message.content as string} key={index} /> : <EliMessage splitResponse={message.content as ISplitResponse} text={message.content as string} eliResponseType={message.eliResponseType as "General" | "WhatComesToMind" | "ChallengeQ" | 'SubjectIntroduction'} key={index} />
            )
        }</div>
    )
}

export default Conversation
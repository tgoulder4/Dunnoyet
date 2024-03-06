import React from 'react'
import { useState } from 'react'
import { IMessage, ILesson, ISplitResponse } from '@/lib/validation/enforceTypes'
import UserMessage from './UserMessage'
import EliMessage from './EliMsg'

function Conversation({ messages }: { messages: IMessage[] }) {
    if (!messages) throw new Error("No messages passed to Conversation")
    // const [messages, setMessages] = useState([] as IMessage[] | null)
    return (
        <div className='px-[28px] w-full'>{
            messages.map((message, index) =>
                message.role === "user" ? <UserMessage text={message.content as string} key={index} /> : <EliMessage splitResponse={message.splitResponse} text={message.content as string} eliResponseType={message.eliResponseType as "General" | "WhatComesToMind" | "ChallengeQ" | 'SubjectIntroduction'} key={index} />
            )
        }</div>
    )
}

export default Conversation
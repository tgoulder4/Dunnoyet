import React from 'react'
import MessagePrimitive from './MessagePrimitive'
import { z } from 'zod'
import { messagesSchema } from '@/lib/validation/primitives'

function Chat({ messages, subject, targetQContent }: { messages: z.infer<typeof messagesSchema>[], subject?: string, targetQContent?: string }) {
    return (
        <div className='flex flex-col gap-3 font-bold'>
            <div className="outlineArea grid place-items-center pt-1 h-16 w-full px-12 bg-[#F4F4F4]">
                <h1 className='w-full font-extrabold'>{subject ? subject : targetQContent}
                </h1>
            </div>
            <div className="mainChat">
                {
                    messages.map((message, index) => {
                        return <MessagePrimitive key={message.content + index} focused={index == messages.length} lastMessageInLesson={false} message={message} />
                    })
                }
            </div>
            <div className="replyArea"></div>
        </div>
    )
}

export default Chat
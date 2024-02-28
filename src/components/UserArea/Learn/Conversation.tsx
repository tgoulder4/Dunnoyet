import React from 'react'
import { useState } from 'react'
import { IMessage, ILesson } from '@/lib/validation/enforceTypes'

function Conversation({ lesson }: { lesson: ILesson }) {
    const [messages, setMessages] = useState([] as IMessage[] | null)
    return (
        <div>Conversation</div>
    )
}

export default Conversation
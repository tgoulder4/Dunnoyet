import React from 'react'
import { useState } from 'react'
import { IMessage } from '@/lib/validation/enforceTypes'

function Conversation() {
    const [messages, setMessages] = useState([] as IMessage[] | null)
    return (
        <div>Conversation</div>
    )
}

export default Conversation
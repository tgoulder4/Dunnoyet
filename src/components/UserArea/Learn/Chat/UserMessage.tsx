import React from 'react'
import Message from './Message'
import { changeColour, colours } from '@/lib/constants'

function UserMessage({ text }: { text: string }) {
    return (
        <Message style={{ borderBottomRightRadius: 0, backgroundColor: changeColour(colours.primary).darken(8).toString() }}>
            <p>{text}</p>
        </Message>
    )
}

export default UserMessage
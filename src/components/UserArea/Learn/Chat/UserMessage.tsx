import React from 'react'
import Message from './Message'
import { changeColour, colours, spacing } from '@/lib/constants'

function UserMessage({ text }: { text: string }) {
    return (
        <div className="w-full flex items-end justify-end">
            <Message className='w-full md:w-max' style={{ marginBottom: spacing.gaps.groupedElement, borderBottomRightRadius: 0, backgroundColor: changeColour(colours.primary).darken(8).toString() }}>
                <p className='text-white'>{text}</p>
            </Message>
        </div>
    )
}

export default UserMessage
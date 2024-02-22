'use client'
import { getEmbeddingForKnowledgeBase } from '@/app/(userArea)/learn/pineconeActions'
import { IMessage } from '@/lib/validation/enforceTypes'
import React, { useState } from 'react'
import Conversation from './Conversation'
type chatProps = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
function ChatWithEli({
    isOpen,
    setIsOpen
}: chatProps) {
    return (<div className='bottom-0 right-0 z-10 w-full max-w-[500px] fixed rounded-t-[10px]'>
        <div className=''>ChatAreaHeader</div>
        {
            isOpen ? <Conversation />
                : null
        }
    </div>
    )
}

export default ChatWithEli
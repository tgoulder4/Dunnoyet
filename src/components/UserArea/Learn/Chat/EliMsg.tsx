import React from 'react'
import Message from './Message'
import { changeColour, colours } from '@/lib/constants'

function EliMessage({ eliResponseType, splitResponse, text }: { text?: string, eliResponseType: "General" | "WhatComesToMind" | "ChallengeQ" | 'SubjectIntroduction', splitResponse?: { text: string, active: boolean } }) {
    return (
        <Message style={{ borderBottomLeftRadius: eliResponseType == "SubjectIntroduction" ? 10 : 0, width: eliResponseType == 'SubjectIntroduction' ? '100%' : 'min-content', backgroundColor: eliResponseType == "WhatComesToMind" || eliResponseType == 'ChallengeQ' ? colours.interrogativeMessage : eliResponseType == 'SubjectIntroduction' ? colours.systemEventMessage : colours.complementary_lightest }}>
            <p style={{ color: splitResponse ? splitResponse.active ? '#000' : '#747474' : '#FFF', fontWeight: 500 }}>{splitResponse ? splitResponse.text : text}</p>
        </Message>
    )
}

export default EliMessage
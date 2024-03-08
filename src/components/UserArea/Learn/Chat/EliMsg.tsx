import React, { useEffect, useState } from 'react'
import Message from './Message'
import { changeColour, colours, spacing } from '@/lib/constants'
import NewButton from '@/components/ui/NewButton'
import { Loader2 } from 'lucide-react';
import { IMessagesEndpointResponsePayload } from '@/lib/validation/enforceTypes'
import { randomBytes } from 'crypto';

function EliMessage({ eliResponseType, splitResponses, text, updateState, setNewMessageControlIndex, setDisableInput, setUpdatingState }: { text?: string, eliResponseType: "General" | "WhatComesToMind" | "ChallengeQ" | 'SubjectIntroduction', splitResponses?: { text: string, active: boolean }[], updateState: (formData: FormData | undefined, explicitState?: IMessagesEndpointResponsePayload | undefined, action?: "UNDERSTOOD" | 'ENDLESSON') => (Promise<void | null> | undefined), setNewMessageControlIndex: React.Dispatch<React.SetStateAction<number>>, setDisableInput: React.Dispatch<React.SetStateAction<boolean>>, setUpdatingState: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [loadingNextMessage, setLoadingNextMessage] = useState(false);
    const [showCTA, setShowCTA] = useState(true);
    const handleContinueOrIUnderstand = ({ type }: { type: "continue" | "understand" }) => {
        // setLoadingNextMessage(true);
        // setDisableInput(true);
        // setUpdatingState(true);
        if (type == "understand") {
            updateState(undefined, undefined, 'UNDERSTOOD')!.then(() => {
                setShowCTA(false);
                // setLoadingNextMessage(false);
                // setDisableInput(false);
                // setUpdatingState(false);
            });
        } else {
            setShowCTA(false);
            setNewMessageControlIndex(prev => prev + 1);
            // setLoadingNextMessage(false);
            // setDisableInput(false);
            // setUpdatingState(false);
        }
    }
    useEffect(() => {
        // console.log("Passed splitResponses: ", splitResponses)
    }, [])
    return (
        <div className={`w-full flex items-start justify-start ${eliResponseType !== "SubjectIntroduction" ? " pr-0 md:pr-8" : ""}`}>
            <Message className='w-full md:w-max' style={{ paddingBottom: eliResponseType == "SubjectIntroduction" ? 40 : 20, borderBottomLeftRadius: 0, borderBottomRightRadius: eliResponseType == "SubjectIntroduction" ? 0 : 20, width: eliResponseType == 'SubjectIntroduction' ? '100%' : '2/3', backgroundColor: eliResponseType == "WhatComesToMind" || eliResponseType == 'ChallengeQ' ? colours.interrogativeMessage : eliResponseType == 'SubjectIntroduction' ? colours.systemEventMessage : colours.complementary_lightest }}>
                <article className='flex flex-col' style={{ rowGap: spacing.gaps.groupedElement }}>
                    {eliResponseType == "SubjectIntroduction" && <h3 className='font-[900] text-white'>Bridging the gap</h3>}
                    {
                        splitResponses ? splitResponses?.map(sr =>
                            <p key={randomBytes(12).toString()} className='w-4/5' style={{ color: sr.active ? '#000' : '#747474', fontWeight: 700 }}>{sr.text}</p>
                        ) : <p className='w-4/5' style={{ color: '#FFF', fontWeight: 500 }}>{text}</p>
                    }
                </article>
                {/* Continue button */}
                {
                    eliResponseType !== "WhatComesToMind" && showCTA &&
                    <NewButton type='button' onClick={() => { handleContinueOrIUnderstand({ type: eliResponseType !== "General" ? 'continue' : 'understand' }) }} buttonVariant='black' className={`${eliResponseType == "SubjectIntroduction" ? "!bg-[rgb(22,22,22,0.5)] border-2 border-black" : loadingNextMessage ? "!bg-[rgb(0,0,0,0.5)]" : 'black'} !px-[1.4rem] !py-[0.9rem] w-max font-bold`}>

                        {eliResponseType == "SubjectIntroduction" ? "Continue" : "I understand!"} (Enter)
                        {
                            loadingNextMessage ? <Loader2 size={20} color='white' className='animate-spin' /> :

                                <svg width="16" height="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 14.25V1.75C0 1.39583 0.117497 1.09896 0.35249 0.859375C0.587484 0.619792 0.878672 0.5 1.22605 0.5C1.57344 0.5 1.86462 0.619792 2.09962 0.859375C2.33461 1.09896 2.45211 1.39583 2.45211 1.75V14.25C2.45211 14.6042 2.33461 14.901 2.09962 15.1406C1.86462 15.3802 1.57344 15.5 1.22605 15.5C0.878672 15.5 0.587484 15.3802 0.35249 15.1406C0.117497 14.901 0 14.6042 0 14.25ZM6.77395 14.375L15.4176 9.0625C15.622 8.9375 15.7701 8.78125 15.8621 8.59375C15.954 8.40625 16 8.20833 16 8C16 7.79167 15.954 7.59375 15.8621 7.40625C15.7701 7.21875 15.622 7.0625 15.4176 6.9375L6.77395 1.625C6.67178 1.5625 6.5645 1.52083 6.45211 1.5C6.33972 1.47917 6.23244 1.46875 6.13027 1.46875C5.80332 1.46875 5.51724 1.58854 5.27203 1.82812C5.02682 2.06771 4.90421 2.36458 4.90421 2.71875V13.2812C4.90421 13.6354 5.02682 13.9323 5.27203 14.1719C5.51724 14.4115 5.80332 14.5312 6.13027 14.5312C6.23244 14.5312 6.33972 14.5208 6.45211 14.5C6.5645 14.4792 6.67178 14.4375 6.77395 14.375ZM7.35632 11.0938V4.90625L12.4138 8L7.35632 11.0938Z" fill="white" />
                                </svg>

                        }
                    </NewButton>
                }
            </Message>
        </div>
    )
}

export default EliMessage
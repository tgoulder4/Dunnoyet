import React, { useEffect, useState } from 'react'
import Message from './Message'
import { changeColour, colours, spacing } from '@/lib/constants'
import NewButton from '@/components/ui/NewButton'
import { Loader2 } from 'lucide-react';
import { randomBytes } from 'crypto';

function EliMessage({ eliResponseType, splitResponses, text, updateState, setControlIndex, setDisableInput, setUpdatingState, lessonReplyInputRef, current, ctaText, systemMessagePosition }: { text?: string, eliResponseType: "General" | "WhatComesToMind" | "ChallengeQ" | 'System', splitResponses?: { text: string, active: boolean }[], updateState: (formData: FormData | undefined, explicitState?: any | undefined, action?: "UNDERSTOOD" | 'ENDLESSON') => (Promise<void | null> | undefined), setControlIndex: React.Dispatch<React.SetStateAction<number>>, setDisableInput: React.Dispatch<React.SetStateAction<boolean>>, setUpdatingState: React.Dispatch<React.SetStateAction<boolean>>, lessonReplyInputRef: React.RefObject<HTMLInputElement>, current: boolean, ctaText?: string, systemMessagePosition?: 'Start' | 'End' }) {
    const [loadingNextMessage, setLoadingNextMessage] = useState(false);
    if (eliResponseType == "System" && !systemMessagePosition) throw new Error("System message must have a systemMessagePosition prop");
    const handleContinueOrIUnderstand = ({ type }: { type: "continue" | "understand" }) => {
        setLoadingNextMessage(true);
        setDisableInput(true);
        setUpdatingState(true);
        if (type == "understand") {
            updateState(undefined, undefined, 'UNDERSTOOD')!.then(() => {
                // setShowCTA(false);
                setLoadingNextMessage(false);
                setDisableInput(false);
                setUpdatingState(false);
            });
        } else {
            console.log("INCREMENTING CONTROL INDEX REF")
            setControlIndex(prev => prev + 1);
            setLoadingNextMessage(false);
            setDisableInput(false);
            setUpdatingState(false);
        }
    }
    const underlineBracketedText = (text: string) => {
        return text.split(/(\[.*?\])/).map((part, index) => {
            if (part.startsWith('[') && part.endsWith(']')) {
                // Wrap text inside brackets with span for underlining
                return <span key={index} style={{ textDecoration: 'underline' }}>{part.slice(1, -1)}</span>;
            } else {
                return part;
            }
        });
    };
    // Use useEffect to attach and detach the keydown event listener
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.keyCode === 13) {
                // Prevent default if you want to avoid submitting forms in case this component is used inside a form
                event.preventDefault();
                // Call your function here
                if (!lessonReplyInputRef.current?.value) handleContinueOrIUnderstand({ type: eliResponseType !== "General" ? 'continue' : 'understand' });
            }
        };

        // Add event listener
        if (current) {
            window.addEventListener('keydown', handleKeyDown);
        }

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [eliResponseType, setDisableInput, setUpdatingState, updateState]);
    return (
        <div className={`w-full flex items-start justify-start ${eliResponseType !== "System" ? " pr-0 md:pr-16" : ""}`}>
            <Message style={{ borderTopRightRadius: systemMessagePosition == "End" ? 0 : 20, borderTopLeftRadius: systemMessagePosition == "End" ? 0 : 20, paddingTop: eliResponseType == "System" ? systemMessagePosition == "Start" ? 25 : 40 : 20, paddingBottom: eliResponseType == "System" ? systemMessagePosition == "Start" ? 40 : 25 : 20, borderBottomLeftRadius: systemMessagePosition == "End" ? 20 : 0, borderBottomRightRadius: eliResponseType == "System" ? systemMessagePosition == "End" ? 20 : 0 : 20, width: eliResponseType == 'System' ? '100%' : '70%', backgroundColor: eliResponseType == "WhatComesToMind" || eliResponseType == 'ChallengeQ' ? colours.interrogativeMessage : eliResponseType == 'System' ? colours.systemEventMessage : colours.complementary_lightest }}>
                <article className='flex flex-col' style={{ rowGap: spacing.gaps.groupedElement }}>
                    {eliResponseType == "System" && <h3 className='font-[900] text-white'>{systemMessagePosition == "Start" ? "Bridging the gap" : "Lesson Complete"}</h3>}
                    {
                        splitResponses?.length ? splitResponses.map((sr, i) =>
                            <p key={randomBytes(12).toString()} style={{ color: (i == splitResponses.length - 1 && current) ? '#000' : '#747474', fontWeight: 700 }}>{underlineBracketedText(sr.text)}</p>
                        ) : <p style={{ color: '#FFF', fontWeight: 500 }}>{underlineBracketedText(text!)}</p>
                    }
                </article>
                {/* Continue button */}
                {
                    eliResponseType !== "WhatComesToMind" && current &&
                    <NewButton type='button' onClick={() => { handleContinueOrIUnderstand({ type: eliResponseType !== "General" ? 'continue' : 'understand' }) }} buttonVariant='black' className={`${eliResponseType == "System" ? "!bg-[rgb(22,22,22,0.5)] border-2 border-black" : loadingNextMessage ? "!bg-[rgb(0,0,0,0.5)]" : 'black'} !px-[1.4rem] !py-[0.9rem] w-max font-bold`}>

                        {ctaText ? ctaText : eliResponseType == "System" ? "Continue (Enter)" : "I understand! (Enter)"}
                        {
                            loadingNextMessage ? <Loader2 size={20} color='white' className='animate-spin' /> :
                                systemMessagePosition == "Start" || eliResponseType == "General" &&
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
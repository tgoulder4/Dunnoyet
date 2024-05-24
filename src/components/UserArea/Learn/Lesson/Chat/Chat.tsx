import React, { FormEvent, useEffect, useRef, useState } from 'react'
import MessagePrimitive from './MessagePrimitive'
import { z } from 'zod'
import { messagesSchema } from '@/lib/validation/primitives'
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { colours, lessonPaddingBottom, sizing, spacing } from '@/lib/constants';
import { LessonTimer } from './Timer';
import { toast } from 'sonner';
import { messagesReceiveSchema } from '@/lib/validation/transfer/transferSchemas';
import { findDistanceUntilLessonEnd } from './Helpers'
import { client } from '@/lib/db/hono';
import axios from 'axios';
function Chat({ lessonState, setLessonState, subject, }: { lessonState: z.infer<typeof messagesReceiveSchema>, setLessonState: React.Dispatch<React.SetStateAction<z.infer<typeof messagesReceiveSchema>>>, subject?: string, targetQContent?: string }) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const {
        msgHistory,
        stage,
        targetQuestion,
        lessonId,
        userId
    } = lessonState;
    const [loading, setLoading] = useState(false);
    const dispatch = async (action: "reply" | "understood") => {
        setLoading(true);
        if (action == "reply") {
            const text = textAreaRef.current?.value;
            if (!text) {
                toast.error("Please enter a message")
                setLoading(false);
                return null;
            } else {
                //send the message
                //post request to /api/messages/response with body of type messagesReceiveSchema
                // const res = await client.api.messages.response.$post({
                //     json: {
                //         action: 'reply',
                //         lessonId,
                //         msgHistory: msgHistory,
                //         stage: stage,
                //         subject: subject,
                //         targetQuestion: targetQuestion,
                //         userId
                //     }
                // })
                console.log("SENDING MESSAGE")
                if (!lessonId || !userId) {
                    toast.error("An error occurred, please try again later")
                    console.error("Missing lessonId or userId in lessonState")
                    return null;
                }
                const res = await axios({
                    method: 'POST',
                    url: '/api/messages/response',
                    data: {
                        action: 'reply',
                        lessonId,
                        msgHistory,
                        stage,
                        subject,
                        targetQuestion,
                        userId
                    }
                })

                setLoading(false);
            }
        } else if (action == "understood") {

        }
    }
    useEffect(() => {
        //if it's their turn, focus the textArea
        if (msgHistory[msgHistory.length - 1].role == 'eli') {
            textAreaRef.current?.focus();
        } else {
            setLoading(true)
        }
    }, [msgHistory])
    return (
        <div className='flex flex-col gap-3 font-bold justify-between h-full' style={{ paddingBottom: lessonPaddingBottom }}>
            <section className='titleAndReplies flex flex-col'>

                <div className="outlineArea flex justify-start items-center pt-2 h-16 w-full px-12 bg-[#F4F4F4]">
                    <div className="flex gap-2">
                        <h1 className='w-full font-extrabold'>{subject ? subject : targetQuestion}</h1>
                        <LessonTimer />
                    </div>
                </div>
                <div className="mainChat">
                    {
                        msgHistory.map((message, index) => {
                            return <MessagePrimitive dispatch={dispatch} loadingNextMsg={loading} key={message.content + index} focused={index == msgHistory.length - 1} lastMessageInLesson={findDistanceUntilLessonEnd(msgHistory) === 0} message={message} />
                        })
                    }
                </div>
            </section>
            <div className="replyArea px-8 animate-in slide-in-from-bottom-4 w-full flex flex-row gap-2">
                <div className="relative w-full">
                    <Textarea onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            dispatch('reply')
                        }
                    }} ref={textAreaRef} disabled={loading} className={`${loading ? '' : ''} p-[15px] px-[20px] h-14 text-base overflow-hidden rounded-xl resize-none text`} placeholder="Reply to Eli..." />
                    <Button type='button' onClick={() => dispatch("reply")} disabled={loading} className='absolute aspect-square bottom-[0.5rem] right-2 p-2 grid place-items-center rounded-xl' style={{ backgroundColor: colours.black }}>
                        {loading ? <Loader2 className='w-4 h-4 animate-spin'></Loader2> : <Send size={24} color='white'></Send>}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Chat
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
import { lessonStateSchema, messagesPayloadSchema, messagesReceiveSchema } from '@/lib/validation/transfer/transferSchemas';
import { findDistanceUntilLessonEnd } from './Helpers'
import { client } from '@/lib/db/hono';
import axios from 'axios';
function Chat({ lessonState, setLessonState, subject, }: { lessonState: z.infer<typeof lessonStateSchema>, setLessonState: React.Dispatch<React.SetStateAction<z.infer<typeof lessonStateSchema>>>, subject?: string, targetQContent?: string }) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const {
        msgHistory,
        stage,
        targetQuestion,
        lessonID,
        userID,
        lastSaved
    } = lessonState;
    const [loading, setLoading] = useState(false);
    //group messages by role
    const groupedMessages = msgHistory.reduce((acc, message) => {
        if (acc.length == 0) return [[message]];
        if (acc[acc.length - 1][0].role == message.role) {
            acc[acc.length - 1].push(message);
            return acc;
        }
        return [...acc, [message]]
    }, [] as z.infer<typeof messagesSchema>[][]);

    console.log("Grouped messages: ", groupedMessages)
    const dispatch = async (action: "reply" | "understood") => {
        setLoading(true);
        if (action == "reply") {
            let text = textAreaRef.current?.value;
            if (!text) {
                if (msgHistory.length == 1) text = msgHistory[0].content;
                toast.error("Please enter a message")
                setLoading(false);
                return null;
            } else {
                console.log("SENDING MESSAGE")
                if (!lessonID || !userID) {
                    toast.error("An error occurred, please try again later")
                    console.error("Missing lessonId or userId in lessonState")
                    return null;
                }
                setLessonState({
                    ...lessonState,
                    msgHistory: [...msgHistory, {
                        role: 'user' as "user" | "eli",
                        content: text,
                    }]
                })
                try {
                    // //prod
                    // const res = await axios({
                    //     method: 'POST',
                    //     url: '/api/messages/response',
                    //     data: {
                    //         action: 'reply',
                    //         lessonId: lessonID,
                    //         msgHistory: [...msgHistory, {
                    //             role: 'user',
                    //             content: text,
                    //         }],
                    //         stage,
                    //         subject,
                    //         targetQuestion: targetQuestion?.point,
                    //         userId: userID,
                    //         lastSaved
                    //     }
                    // });
                    //mock res
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    const res = {
                        data: {
                            payload: {
                                newMessages: [
                                    {
                                        role: 'eli',
                                        content: 'which are intrinsically negative',
                                        KP: {
                                            KP: "which are negative",
                                            confidence: 1,
                                            TwoDvK: [2, 12]
                                        },
                                        eliResponseType: 'General',
                                        distanceAwayFromFinishingLesson: 1
                                    },
                                ],
                                stage: 'main',
                                lastSaved: "2024-05-24T01:48:24.571Z"
                            }
                        }
                    }

                    console.log("Response: ", res)
                    const parseResult = messagesPayloadSchema.safeParse(res.data.payload);
                    if (!parseResult.success) {
                        console.error("Failed to parse messagesPayloadSchema: " + parseResult.error)
                        //parse wrong @ chat
                        toast.error("An error occurred, please try again later PR@Chat")
                        return null;
                    }
                    console.log("Parse result: ", parseResult.data)
                    //messagesPayloadSchema -> lessonStateSchema
                    const nextState = {
                        ...lessonState,
                        ...parseResult.data,
                        stage: parseResult.data.stage,
                        //if their response is missing, add it before ...msgHistory
                        msgHistory: [...msgHistory, {
                            role: 'user' as "user" | "eli",
                            content: text,
                            //example KP for testing. This KP should be added to the user's msg as soon as user isRight
                            KP: {
                                KP: text,
                                confidence: 2,
                                TwoDvK: [2, 9]
                            },
                        }, ...parseResult.data.newMessages!]
                    };
                    console.log("Next state: ", nextState)
                    setLessonState(nextState);
                } catch (e) {
                    console.error("Error sending message: ", e)
                    //post request failed @ chat
                    toast.error("An error occurred, please try again later POSTRF@Chat")
                }
                setLoading(false);
                textAreaRef.current!.value = '';
            }
        } else if (action == "understood") {
            try {
                // //prod
                // const res = await axios({
                //     method: 'POST',
                //     url: '/api/messages/response',
                //     data: {
                //         action: 'understood',
                //         lessonId: lessonID,
                //         msgHistory,
                //         stage,
                //         subject,
                //         targetQuestion: targetQuestion?.point,
                //         userId: userID,
                //         lastSaved
                //     }
                // });

                //mock
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const res = {
                    data: {
                        // mock: understood during main
                        // payload: {
                        //     newMessages: [
                        //         {
                        //             role: 'eli',
                        //             content: 'which are intrinsically negative',
                        //             KP: {
                        //                 KP: "which are negative",
                        //                 confidence: 1,
                        //                 TwoDvK: [62, 58]
                        //             },
                        //             eliResponseType: 'General'
                        //         },
                        //     ],
                        //     stage: 'main',
                        //     lastSaved: "2024-05-24T01:48:24.571Z"
                        // }
                        // mock: end lesson after final understood
                        payload: {
                            newMessages: [],
                            stage: 'end',
                            experiencePrior: 50,
                            experienceNow: 100,
                            lastSaved
                        }
                    }
                }
                console.log("Response: ", res)
                const parseResult = messagesPayloadSchema.safeParse(res.data.payload);
                if (!parseResult.success) {
                    console.error("Failed to parse messagesPayloadSchema: " + parseResult.error)
                    //parse wrong @ chat
                    toast.error("An error occurred, please try again later PR@Chat")
                    return null;
                }
                console.log("Parse result: ", parseResult.data)
                //messagesPayloadSchema -> lessonStateSchema
                //if the newMessage isn't of type whatcomestomind, set the most recent message in msgHistory to confidence 2
                if (msgHistory[msgHistory.length - 1].eliResponseType == 'General') {
                    const newMsgHistory = [...msgHistory];
                    newMsgHistory[msgHistory.length - 1].KP!.confidence = 2;
                    setLessonState({
                        ...lessonState,
                        ...parseResult.data,
                        stage: parseResult.data.stage,
                        //if their response is missing, add it before ...msgHistory
                        msgHistory: [...newMsgHistory, ...parseResult.data.newMessages!]
                    });
                    setLoading(false);
                    return null;
                }
                const nextState = {
                    ...lessonState,
                    ...parseResult.data,
                    stage: parseResult.data.stage,
                    //if their response is missing, add it before ...msgHistory
                    msgHistory: [...msgHistory, ...parseResult.data.newMessages!]
                };
                console.log("Next state: ", nextState)
                setLessonState(nextState);
                setLoading(false);
                return null;
            } catch (e) {
                console.error("Error sending understood: ", e);
                toast.error("An error occurred, please try again later POSTRF1@Chat")
            }
        }
    }
    useEffect(() => {
        //if it's their turn, focus the textArea
        const latestMsg = msgHistory[msgHistory.length - 1]
        if (targetQuestion?.point == "Why do electrons repel each other?" && msgHistory.length == 1) {
            textAreaRef.current?.focus();
            //dev only
            if (textAreaRef.current) textAreaRef.current.value = 'Electrons are fundamental particles'
        }
    }, [msgHistory])
    useEffect(() => {
        //if it's their turn, focus the textArea
        async function main() {
            if (msgHistory[msgHistory.length - 1].role == 'user') {
                setLoading(true);
                //get the response
                await dispatch('reply')
            }
        }
        main()
    }, [])
    return (
        <div className='flex flex-col gap-3 font-bold justify-between h-full' style={{ paddingBottom: lessonPaddingBottom }}>
            <section className='titleAndReplies flex flex-col gap-3 h-full'>

                <div className="outlineArea flex justify-start items-center pt-2 h-16 w-full px-12 bg-[#F4F4F4]">
                    <div className="flex gap-2">
                        <h1 className='w-full font-extrabold'>{subject ? subject : targetQuestion?.point ?? "Error"}</h1>
                        <LessonTimer />
                    </div>
                </div>
                <div className="mainChat max-h-full h-full overflow-y-auto">
                    {
                        groupedMessages.map((groupSet, index) => {
                            //if they're two messages of the same type in a row just push it to messages 
                            return <MessagePrimitive dispatch={dispatch} loadingNextMsg={loading} key={groupSet[0].content + index} focused={index == groupedMessages.length - 1} lastMessageInLesson={findDistanceUntilLessonEnd(msgHistory) === 1} messages={groupSet} />
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
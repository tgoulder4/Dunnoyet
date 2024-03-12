import React, { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import { IMessage, ILesson, ISplitResponse, ILessonState } from '@/lib/validation/enforceTypes'
import UserMessage from './UserMessage'
import EliMessage from './EliMsg'
import { IMessagesEndpointResponsePayload } from '@/lib/validation/enforceTypes'
import { randomBytes } from 'crypto'
import { render } from 'react-dom'
var equal = require('deep-equal')
function Conversation({ lessonState, updateState, setDisableInput, setUpdatingState, lessonReplyInputRef, theirReply }: { lessonState: ILessonState, updateState: (formData: FormData | undefined, explicitState?: IMessagesEndpointResponsePayload | undefined) => (Promise<void | null> | undefined), setDisableInput: React.Dispatch<React.SetStateAction<boolean>>, setUpdatingState: React.Dispatch<React.SetStateAction<boolean>>, lessonReplyInputRef: React.RefObject<HTMLInputElement>, theirReply: string }) {
    // const [messages, setMessages] = useState([] as IMessage[] | null)
    // console.log("Conversation rendered, theirReply is: ", theirReply)
    const { oldMessages, newMessages, metadata } = lessonState;
    let threadsForSeparationOfMessages = useRef(metadata.threads);
    const [newMessageControlIndex, setNewMessageControlIndex] = useState(0);
    const currMsgsToRender = useRef([...oldMessages] as IMessage[]);
    const messagesToRender = useMemo(() => [...currMsgsToRender.current, newMessages[newMessageControlIndex]] as IMessage[], [newMessages, newMessageControlIndex, lessonState]);
    currMsgsToRender.current = messagesToRender;
    console.log("Control index is: ", newMessageControlIndex);
    console.log("MessagesToRender is: ", messagesToRender, " and newEliMessageToRender is: ", newMessages[newMessageControlIndex], " and oldMessages is: ", oldMessages)
    const scrollRef = useRef<HTMLDivElement>(null);
    const getJsxFromAllMessages = (messages: IMessage[]) => {
        let customIndex = 0;
        const jsxMessages = [];

        while (customIndex < messages.length) {
            const message = messages[customIndex];
            let key;

            if (message.splitResponse) {
                key = `${message.splitResponse.text}-${customIndex}`;
            } else if (message.content) {
                key = `${message.content}-${customIndex}`;
            } else {
                throw new Error("Message has no content or splitResponse, could not generate key for message.");
            }

            if (message.role === "user") {
                if (!message.content) throw new Error("User message has no content.");
                jsxMessages.push(<UserMessage text={message.content} key={key} />);
            } else {
                if (message.eliResponseType !== "General") {
                    jsxMessages.push(<EliMessage current={customIndex === messages.length - 1} text={message.content} eliResponseType={message.eliResponseType as any} lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setNewMessageControlIndex={setNewMessageControlIndex} key={key} />);
                } else if (message.content === "BREAK") {
                    jsxMessages.push(<div className='w-full h-4' key={key}></div>);
                } else {
                    let groupSize = 1;
                    while (messages[customIndex + groupSize] && messages[customIndex + groupSize].eliResponseType === "General") {
                        groupSize++;
                    }
                    const splitResponses = messages.slice(customIndex, customIndex + groupSize).map(msg => msg.splitResponse);
                    if (splitResponses.includes(undefined)) throw new Error("SplitResponse includes undefined in splitResponses array. It should contain 1 general response at minimum.")
                    jsxMessages.push(<EliMessage current={customIndex === messages.length - 1} splitResponses={splitResponses as any} eliResponseType={"General"} updateState={updateState} lessonReplyInputRef={lessonReplyInputRef} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setNewMessageControlIndex={setNewMessageControlIndex} key={key} />);
                    customIndex += groupSize - 1; // Adjust for the increase in group size
                }
            }
            customIndex++;
        }

        return jsxMessages;
    };
    // const [messages, setMessages] = useState([...oldMessages] as IMessage[]);
    //its joined if itself and its previous message is a general message
    // Function to render old messages with correct grouping

    useEffect(() => {
        if (messagesToRender[messagesToRender.length - 1].eliResponseType === "SubjectIntroduction") { setDisableInput(true); } else { setDisableInput(false); }
    }, []);
    useEffect(() => {
        console.log("Equating stored thread ref to new thread ref - ", threadsForSeparationOfMessages.current, " becomes ", metadata.threads)
        threadsForSeparationOfMessages.current = metadata.threads;
    }, [metadata.threads.length]);
    useEffect(() => {
        console.log("settingMessageToRender as either lessonState or controlIndex changed. NewMessageControlIndex is: ", newMessageControlIndex, " and newMessages is: ", newMessages)
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messagesToRender]);

    //spy and see if threads.length has changed, if it has then start a new general message else attach to the current general message
    return (
        <div className='px-[28px] w-full h-full flex flex-col overflow-y-scroll py-[14px]' ref={scrollRef}>
            <div className="h-4/5 w-full"></div>
            {
                ...getJsxFromAllMessages(messagesToRender)
            }
            {
                theirReply && <><UserMessage text={theirReply} /> <EliMessage current={false} text='Loading...' eliResponseType='General' lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setNewMessageControlIndex={setNewMessageControlIndex} /></>
            }
            {
                metadata.action == "ENDLESSON" && <EliMessage current={true} text='Lesson complete' eliResponseType='SubjectIntroduction'
                    lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setNewMessageControlIndex={setNewMessageControlIndex}
                />
            }
        </div>
    )
}

export default Conversation
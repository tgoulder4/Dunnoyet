import React, { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import { IMessage, ILesson, ISplitResponse } from '@/lib/validation/enforceTypes'
import UserMessage from './UserMessage'
import EliMessage from './EliMsg'
import { IMessagesEndpointResponsePayload } from '@/lib/validation/enforceTypes'
import { randomBytes } from 'crypto'
import { render } from 'react-dom'

function Conversation({ oldMessages, newMessages, updateState, setDisableInput, setUpdatingState, lessonReplyInputRef }: { oldMessages: IMessage[], newMessages: IMessage[], updateState: (formData: FormData | undefined, explicitState?: IMessagesEndpointResponsePayload | undefined) => (Promise<void | null> | undefined), setDisableInput: React.Dispatch<React.SetStateAction<boolean>>, setUpdatingState: React.Dispatch<React.SetStateAction<boolean>>, lessonReplyInputRef: React.RefObject<HTMLInputElement> }) {
    // const [messages, setMessages] = useState([] as IMessage[] | null)
    const [newMessageControlIndex, setNewMessageControlIndex] = useState(1);
    const newEliMessagesToRender = newMessages.slice(0, newMessageControlIndex) as IMessage[];
    const scrollRef = useRef<HTMLDivElement>(null);

    // const [messages, setMessages] = useState([...oldMessages] as IMessage[]);
    //its joined if itself and its previous message is a general message
    // Function to render old messages with correct grouping
    const renderMessages = () => {
        let customIndex = 0;
        const allMessages = [...oldMessages, ...newEliMessagesToRender];
        // console.log("All messages: ", allMessages)
        console.log("==================RERENDERING===================");
        console.log("All messages being rendered now: ", allMessages)
        return allMessages.map((message, index) => {
            console.log("Mapping message with index: ", customIndex, " and message: ", message)
            if (customIndex > allMessages.length - 1) return;
            if (message.splitResponse) {
                message.id = `${message.splitResponse.text}`;
            } else if (message.content) {
                message.id = `${message.content}`;
            } else {
                throw new Error("Message has no content or splitResponse, could not generate key for message.")
            }
            // console.log("Key for message is: ", message.id, " and message is: ", message)
            if (!message.id) throw new Error("Message has no ID, could not generate key for message.")
            if (message.role === "user") {
                console.log(message.content + " has key " + message.id + " on this render")
                return <UserMessage text={message.content as string} key={message.id} />;
            } else {
                if (message.eliResponseType !== "General") {
                    console.log(message.content + " has key " + message.id + " on this render")
                    return <EliMessage current={index == allMessages.length - 1} text={message.content as string} eliResponseType={message.eliResponseType as any} lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setNewMessageControlIndex={setNewMessageControlIndex} key={message.id} />;
                }
                let groupSize = 1;
                while (allMessages[index + groupSize]?.eliResponseType === "General") {
                    groupSize++;
                }
                // console.log("Group: ", allMessages.slice(index, index + groupSize).map(msg => msg.splitResponse!), ", all: ", allMessages)
                customIndex = index + groupSize;
                // console.log("CustomIndex is now: ", customIndex)
                console.log(message.splitResponse?.text + " has key " + message.id + " on this render")
                return (<EliMessage current={index == allMessages.length - 1} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} lessonReplyInputRef={lessonReplyInputRef} splitResponses={allMessages.slice(index, index + groupSize).map(msg => msg.splitResponse!)} text={message.content as string} eliResponseType={message.eliResponseType} updateState={updateState} setNewMessageControlIndex={setNewMessageControlIndex} key={message.id} />);
            }
        });
    };
    const messages = useMemo(() => renderMessages(), [oldMessages, newEliMessagesToRender]);
    useEffect(() => {
        if (newEliMessagesToRender[newEliMessagesToRender.length - 1].eliResponseType === "SubjectIntroduction") { setDisableInput(true); } else { setDisableInput(false); }
    }, []);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }
        , [messages]);

    //spy and see if threads.length has changed, if it has then start a new general message else attach to the current general message
    return (
        <div className='px-[28px] w-full h-full flex flex-col overflow-y-scroll py-[14px]' ref={scrollRef}>
            <div className="h-4/5 w-full"></div>
            {
                ...messages
            }
        </div>
    )
}

export default Conversation
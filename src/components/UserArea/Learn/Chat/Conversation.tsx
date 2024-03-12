import React, { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import { IMessage, ILesson, ISplitResponse, ILessonState } from '@/lib/validation/enforceTypes'
import UserMessage from './UserMessage'
import EliMessage from './EliMsg'
import { IMessagesEndpointResponsePayload } from '@/lib/validation/enforceTypes'
import { randomBytes } from 'crypto'
import { render } from 'react-dom'

function Conversation({ lessonState, updateState, setDisableInput, setUpdatingState, lessonReplyInputRef, theirReply }: { lessonState: ILessonState, updateState: (formData: FormData | undefined, explicitState?: IMessagesEndpointResponsePayload | undefined) => (Promise<void | null> | undefined), setDisableInput: React.Dispatch<React.SetStateAction<boolean>>, setUpdatingState: React.Dispatch<React.SetStateAction<boolean>>, lessonReplyInputRef: React.RefObject<HTMLInputElement>, theirReply: string }) {
    // const [messages, setMessages] = useState([] as IMessage[] | null)
    // console.log("Conversation rendered, theirReply is: ", theirReply)
    const { oldMessages, newMessages, metadata } = lessonState;
    let threadsForSeparationOfMessages = useRef(metadata.threads);
    const [newMessageControlIndex, setNewMessageControlIndex] = useState(1);
    const newEliMessagesToRender = newMessages.slice(0, newMessageControlIndex) as IMessage[];
    const scrollRef = useRef<HTMLDivElement>(null);
    const getJsxFromMessages = (messages: IMessage[], type: 'newmsgs' | 'oldmsgs', joinWithMsg?: IMessage) => {
        let customIndex = 0;
        return messages.map((message, index) => {
            if (customIndex > messages.length - 1) return;
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
                return <UserMessage text={message.content as string} key={message.id} />;
            } else {
                if (message.eliResponseType !== "General") {
                    return <EliMessage current={type == "newmsgs" ? index == messages.length - 1 : false} text={message.content as string} eliResponseType={message.eliResponseType as any} lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setNewMessageControlIndex={setNewMessageControlIndex} key={message.id} />;
                }
                let groupSize = 1;
                while (messages[index + groupSize]?.eliResponseType === "General") {
                    groupSize++;
                }
                customIndex = index + groupSize;
                // Adjust splitResponses based on the index and if joinWithMsg is provided and if threads length hasn't changed
                console.log("JoinWithMsg is ", joinWithMsg, " for this message ", message.splitResponse?.text)
                const splitResponses = joinWithMsg && checkIfLastTwoMsgsShouldBeJoined()
                    ? [joinWithMsg.splitResponse!, ...messages.slice(index, index + groupSize).map(msg => msg.splitResponse!)]
                    : messages.slice(index, index + groupSize).map(msg => msg.splitResponse!);
                return (<EliMessage current={type == "newmsgs" ? index == messages.length - 1 : false} splitResponses={splitResponses} text={message.content as string} eliResponseType={message.eliResponseType} updateState={updateState} lessonReplyInputRef={lessonReplyInputRef} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setNewMessageControlIndex={setNewMessageControlIndex} key={message.id} />);
            }
        });
    }
    //render all the old messages except from the last one if the last one needs to be visually linked to the new messages
    console.log("Old messages are: ", oldMessages)
    console.log("New messages are: ", newMessages)
    const checkIfLastTwoMsgsShouldBeJoined = (): boolean => {
        console.log("Comparing thread lengths ", threadsForSeparationOfMessages.current.length, " and ", metadata.threads.length)
        const result = (oldMessages[oldMessages.length - 1].splitResponse && newMessages[0].splitResponse && (lessonState.metadata.threads.length === threadsForSeparationOfMessages.current.length))
        console.log("Result of checkIfLastTwoMsgsShouldBeJoined is: ", result)
        if (result == undefined) return false;
        return result;
    }
    //if the last msg is on the same thread level and a splitResponse, don't render it as old
    const _oldMessages = getJsxFromMessages(checkIfLastTwoMsgsShouldBeJoined() ? oldMessages.slice(0, -1) : oldMessages, "oldmsgs")
    const _newMessages = getJsxFromMessages(newEliMessagesToRender, 'newmsgs', checkIfLastTwoMsgsShouldBeJoined() ? oldMessages[oldMessages.length - 1] : undefined);
    // const [messages, setMessages] = useState([...oldMessages] as IMessage[]);
    //its joined if itself and its previous message is a general message
    // Function to render old messages with correct grouping

    useEffect(() => {
        if (newEliMessagesToRender[newEliMessagesToRender.length - 1].eliResponseType === "SubjectIntroduction") { setDisableInput(true); } else { setDisableInput(false); }
    }, []);
    useEffect(() => {
        console.log("Equating stored thread ref to new thread ref - ", threadsForSeparationOfMessages.current, " becomes ", metadata.threads)
        threadsForSeparationOfMessages.current = metadata.threads;
    }, [metadata.threads.length]);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [_newMessages]);

    //spy and see if threads.length has changed, if it has then start a new general message else attach to the current general message
    return (
        <div className='px-[28px] w-full h-full flex flex-col overflow-y-scroll py-[14px]' ref={scrollRef}>
            <div className="h-4/5 w-full"></div>
            {
                ..._oldMessages
            }
            {
                ..._newMessages
            }
            {
                theirReply && <><UserMessage text={theirReply} /> <EliMessage current={false} text='Loading...' eliResponseType='General' lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setNewMessageControlIndex={setNewMessageControlIndex} /></>
            }
        </div>
    )
}

export default Conversation
import React, { useEffect, useMemo } from 'react'
import { useState } from 'react'
import { IMessage, ILesson, ISplitResponse } from '@/lib/validation/enforceTypes'
import UserMessage from './UserMessage'
import EliMessage from './EliMsg'
import { IMessagesEndpointResponsePayload } from '@/lib/validation/enforceTypes'
import { randomBytes } from 'crypto'

function Conversation({ oldMessages, newMessages, updateState, setDisableInput, setUpdatingState }: { oldMessages: IMessage[], newMessages: IMessage[], updateState: (formData: FormData | undefined, explicitState?: IMessagesEndpointResponsePayload | undefined) => (Promise<void | null> | undefined), setDisableInput: React.Dispatch<React.SetStateAction<boolean>>, setUpdatingState: React.Dispatch<React.SetStateAction<boolean>> }) {
    // const [messages, setMessages] = useState([] as IMessage[] | null)
    const [newMessageControlIndex, setNewMessageControlIndex] = useState(1);
    const newEliMessagesToRender = newMessages.slice(0, newMessageControlIndex) as IMessage[];
    if (newEliMessagesToRender[newEliMessagesToRender.length - 1].eliResponseType === "SubjectIntroduction") { setDisableInput(true); } else { setDisableInput(false); }
    // const [messages, setMessages] = useState([...oldMessages] as IMessage[]);
    //its joined if itself and its previous message is a general message
    useEffect(() => {
    }, [])
    const messages = [];
    // Function to render old messages with correct grouping
    const renderMessages = () => {
        let customIndex = 0;
        const allMessages = [...oldMessages, ...newEliMessagesToRender];
        console.log("All messages: ", allMessages)
        return allMessages.map((message, index) => {
            console.log("Mapping message with index: ", customIndex, " and message: ", message)
            if (customIndex > allMessages.length - 1) return;
            const key = message.content + randomBytes(12).toString();
            if (message.role === "user") {
                return <UserMessage text={message.content as string} key={key} />;
            } else {
                if (message.eliResponseType !== "General") {
                    return <EliMessage text={message.content as string} eliResponseType={message.eliResponseType as any} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setNewMessageControlIndex={setNewMessageControlIndex} key={key} />;
                }
                let groupSize = 1;
                while (allMessages[index + groupSize]?.eliResponseType === "General") {
                    groupSize++;
                }
                console.log("Group: ", allMessages.slice(index, index + groupSize).map(msg => msg.splitResponse!), ", all: ", allMessages)
                customIndex = index + groupSize;
                console.log("CustomIndex is now: ", customIndex)
                return (<EliMessage setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} splitResponses={allMessages.slice(index, index + groupSize).map(msg => msg.splitResponse!)} text={message.content as string} eliResponseType={message.eliResponseType} updateState={updateState} setNewMessageControlIndex={setNewMessageControlIndex} key={key} />);
            }
        });
    };

    //spy and see if threads.length has changed, if it has then start a new general message else attach to the current general message
    return (
        <div className='px-[28px] w-full h-[60vh] flex flex-col justify-end overflow-y-scroll'>
            {
                renderMessages()
            }
        </div>
    )
}

export default Conversation
import React from 'react'
import { useState } from 'react'
import { IMessage, ILesson, ISplitResponse } from '@/lib/validation/enforceTypes'
import UserMessage from './UserMessage'
import EliMessage from './EliMsg'
import { IMessagesEndpointResponsePayload } from '@/lib/validation/enforceTypes'

function Conversation({ oldMessages, newMessages, updateState, setDisableInput }: { oldMessages: IMessage[], newMessages: IMessage[], updateState: (formData: FormData | undefined, explicitState?: IMessagesEndpointResponsePayload | undefined) => (Promise<void | null> | undefined), setDisableInput: React.Dispatch<React.SetStateAction<boolean>> }) {
    console.log("OLD MSGS PASSED TO CONVERSATION: ", oldMessages, "NEW MSGS PASSED TO CONVERSATION: ", newMessages)
    // const [messages, setMessages] = useState([] as IMessage[] | null)
    const [newMessageControlIndex, setNewMessageControlIndex] = useState(1);
    const newEliMessagesToRender = newMessages.slice(0, newMessageControlIndex) as IMessage[];
    //its joined if itself and its previous message is a general message
    if (newEliMessagesToRender[newEliMessagesToRender.length - 1].eliResponseType === "SubjectIntroduction") setDisableInput(true);
    // Function to render old messages with correct grouping
    const renderMessages = () => {
        const allMessages = [...oldMessages, ...newEliMessagesToRender];
        return allMessages.map((message, index) => {
            if (message.role === "user") {
                return <UserMessage text={message.content as string} key={index} />;
            } else {
                if (message.eliResponseType !== "General") {
                    return <EliMessage text={message.content as string} eliResponseType={message.eliResponseType as any} updateState={updateState} setNewMessageControlIndex={setNewMessageControlIndex} key={index} />;
                }
                let groupSize = 1;
                while (oldMessages[index + groupSize]?.eliResponseType === "General") {
                    groupSize++;
                }
                return (<EliMessage splitResponses={oldMessages.slice(index, index + groupSize).map(msg => msg.splitResponse!)} text={message.content as string} eliResponseType={message.eliResponseType} updateState={updateState} setNewMessageControlIndex={setNewMessageControlIndex} key={index} />);
            }
        });
    };
    //spy and see if threads.length has changed, if it has then start a new general message else attach to the current general message
    return (
        <div className='px-[28px] w-full h-[60vh] flex flex-col justify-end overflow-y-scroll'>
            {renderMessages()}
        </div>
    )
}

export default Conversation
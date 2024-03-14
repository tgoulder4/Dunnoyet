import React, { useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import { IMessage, ILesson, ISplitResponse, ILessonState } from '@/lib/validation/enforceTypes'
import UserMessage from './UserMessage'
import EliMessage from './EliMsg'
import { IMessagesEndpointResponsePayload } from '@/lib/validation/enforceTypes'
var equal = require('deep-equal')
function Conversation({ lessonState, updateState, setDisableInput, setUpdatingState, lessonReplyInputRef, initialQ }: { lessonState: ILessonState, updateState: (formData: FormData | undefined, explicitState?: IMessagesEndpointResponsePayload | undefined) => (Promise<void | null> | undefined), setDisableInput: React.Dispatch<React.SetStateAction<boolean>>, setUpdatingState: React.Dispatch<React.SetStateAction<boolean>>, lessonReplyInputRef: React.RefObject<HTMLInputElement>, initialQ: string | undefined }) {
    // const [messages, setMessages] = useState([] as IMessage[] | null)
    const { newMessages, metadata } = lessonState;
    const prevState = useRef(lessonState);     // Check if newMessages was the cause of the re-render to set the contronIndexRef to 0
    const threadsForSeparationOfMessages = useRef(metadata.threads);
    const [controlIndex, setControlIndex] = useState(0);
    let controlIndexRef = controlIndex;
    console.log("Conversation rendering, lessonState is: ", lessonState, " controlRef is: ", controlIndex);
    const [messagesToRender, setMessagesToRender] = useState([] as IMessage[]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const getJsxFromAllMessages = (messages: IMessage[]) => {
        console.log("Messages passed to getJsxFromAllMessages: ", messages)
        let customIndex = 0;
        if (messages.length === 0) return []
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
                    jsxMessages.push(<EliMessage current={customIndex === messages.length - 1} text={message.content} eliResponseType={message.eliResponseType as any} lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setControlIndex={setControlIndex} key={key} />);
                } else if (message.content === "BREAK") {
                    jsxMessages.push(<div className='w-full h-4' key={key}></div>);
                } else {
                    let groupSize = 1;
                    while (messages[customIndex + groupSize] && messages[customIndex + groupSize].eliResponseType === "General") {
                        groupSize++;
                    }
                    const splitResponses = messages.slice(customIndex, customIndex + groupSize).map(msg => msg.splitResponse);
                    if (splitResponses.includes(undefined)) throw new Error("SplitResponse includes undefined in splitResponses array. It should contain 1 general response at minimum.")
                    jsxMessages.push(<EliMessage current={customIndex === messages.length - 1} splitResponses={splitResponses as any} eliResponseType={"General"} updateState={updateState} lessonReplyInputRef={lessonReplyInputRef} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setControlIndex={setControlIndex} key={key} />);
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
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messagesToRender]);
    useEffect(() => {
        //if newMessages was the cause then setControlIndex to 0
        // if (prevState.current.oldMessages !== oldMessages) {
        //     console.log("Old messages has changed")
        //     theirReply = oldMessages[oldMessages.length - 1].role == "user" ? oldMessages[oldMessages.length - 1] : undefined;
        // }
        const theirReply = lessonReplyInputRef?.current?.value || initialQ || "";
        console.log("TheirReply: ", theirReply)
        if (!equal(newMessages, prevState.current.newMessages)) {
            console.log("New messages has changed, setting controlIndex to 0")
            controlIndexRef = 0;
        }
        const theirReplyMsg = { content: theirReply, role: "user" } as IMessage;
        console.log("Control index ref being used is: ", controlIndex); //WHY IS THIS STILL 1
        if (messagesToRender.length && newMessages[controlIndexRef].eliResponseType === "SubjectIntroduction") { setDisableInput(true); } else { setDisableInput(false); }
        if (messagesToRender.length == 0) {
            setMessagesToRender([theirReplyMsg!, newMessages[controlIndexRef]]);
        }
        else if (theirReply.length !== 0) {
            console.log("Their reply wasn't undefined, rendering messages you see with controlIndex: ", controlIndexRef, " and newMessages: ", newMessages);
            setMessagesToRender(prev => [...prev, theirReplyMsg, newMessages[controlIndexRef]]);
            if (!lessonReplyInputRef.current) throw new Error("lessonReplyInputRef is undefined, can't clear the reply");
            lessonReplyInputRef.current.value = "";
        } else {
            console.log("Their reply was undefined, setting messages to render to: ", [...messagesToRender, newMessages[controlIndexRef]])
            setMessagesToRender(prev => [...prev, newMessages[controlIndexRef]]);
        }
    }, [controlIndex, newMessages]);
    //spy and see if threads.length has changed, if it has then start a new general message else attach to the current general message
    return (
        <div className='px-[28px] w-full h-full flex flex-col overflow-y-scroll py-[14px]' ref={scrollRef}>
            <div className="h-4/5 w-full"></div>
            {
                ...getJsxFromAllMessages(messagesToRender)
            }
            {/* {
                theirReply && <><UserMessage text={theirReply.content as string} /> <EliMessage current={false} text='Loading...' eliResponseType='General' lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setNewMessageControlIndex={setNewMessageControlIndex} /></>
            } */}
            {
                metadata.action == "ENDLESSON" && <EliMessage current={true} text='Lesson complete' eliResponseType='SubjectIntroduction'
                    lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setControlIndex={setControlIndex}
                />
            }
        </div>
    )
}

export default Conversation
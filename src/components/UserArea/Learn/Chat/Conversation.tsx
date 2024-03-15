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
    // if (newMessages.length == 0) {
    //     controlIndexRef = -1;
    // }; //end of lesson")
    const getJsxFromAllMessages = (messages: IMessage[]) => {
        console.log("Messages passed to getJsxFromAllMessages: ", messages)
        let index = 0;
        if (messages.length === 0) return []
        const jsxMessages = [];

        while (index < messages.length) {
            const message = messages[index];
            let key;
            if (controlIndex == -1) {
                jsxMessages.push(<></>)
                //break out of while loop
                break;
            };
            if (message.splitResponse) {
                key = `${message.splitResponse.text}-${index}`;
            } else if (message.content) {
                key = `${message.content}-${index}`;
            } else {
                throw new Error("Message has no content or splitResponse, could not generate key for message.");
            }

            if (message.role === "user") {
                if (!message.content) throw new Error("User message has no content.");
                jsxMessages.push(<UserMessage text={message.content} key={key} />);
            } else {
                if (message.content === "BREAK") {
                    jsxMessages.push(<div className='w-full h-4' key={key}></div>);
                }
                else if (message.eliResponseType !== "General") {
                    jsxMessages.push(<EliMessage current={index === messages.length - 1 && newMessages.length !== 0} text={message.content} eliResponseType={message.eliResponseType as any} systemMessagePosition='Start' lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setControlIndex={setControlIndex} key={key} />);
                } else {
                    let groupSize = 1;
                    while (messages[index + groupSize] && messages[index + groupSize].eliResponseType === "General") {
                        groupSize++;
                    }
                    const splitResponses = messages.slice(index, index + groupSize).map(msg => msg.splitResponse);
                    if (splitResponses.includes(undefined)) throw new Error("SplitResponse includes undefined in splitResponses array. It should contain 1 general response at minimum.")
                    console.log("Current is ", index === messages.length - 1, " - index is ", index, " - messages.length - splitREsponses.length ", messages.length - splitResponses.length)
                    jsxMessages.push(<EliMessage current={index === messages.length - splitResponses.length && newMessages.length !== 0} splitResponses={splitResponses as any} eliResponseType={"General"} updateState={updateState} lessonReplyInputRef={lessonReplyInputRef} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setControlIndex={setControlIndex} key={key} />);
                    index += groupSize - 1; // Adjust for the increase in group size
                }
            }
            index++;
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
        //animate messages in

    }, [messagesToRender, newMessages]);
    useEffect(() => {
        //if newMessages was the cause then setControlIndex to 0
        // if (prevState.current.oldMessages !== oldMessages) {
        //     console.log("Old messages has changed")
        //     theirReply = oldMessages[oldMessages.length - 1].role == "user" ? oldMessages[oldMessages.length - 1] : undefined;
        // }
        console.log("-------- ControlIndex is ", controlIndexRef, " newMessages is ", newMessages)
        const theirReply = lessonReplyInputRef?.current?.value || initialQ || "";
        console.log("TheirReply: ", theirReply)
        if (!equal(newMessages, prevState.current.newMessages)) {
            console.log("New messages has changed, setting controlIndex to 0")
            controlIndexRef = 0;
        }
        const theirReplyMsg = { content: theirReply, role: "user" } as IMessage;
        const updatedMessages = [] as IMessage[];
        console.log("Control index ref being used is: ", controlIndex); //WHY IS THIS STILL 1
        if (newMessages.length == 0) {

            setMessagesToRender(messagesToRender)
            return;
        }
        if (messagesToRender.length && newMessages[controlIndexRef].eliResponseType === "System") { setDisableInput(true); } else { setDisableInput(false); }
        if (messagesToRender.length == 0) {
            updatedMessages.push(theirReplyMsg!);
        }
        else if (theirReply.length !== 0) {
            console.log("Their reply wasn't undefined, rendering messages you see with controlIndex: ", controlIndexRef, " and newMessages: ", newMessages);
            updatedMessages.push(...messagesToRender, theirReplyMsg)
            if (!lessonReplyInputRef.current) throw new Error("lessonReplyInputRef is undefined, can't clear the reply");
            lessonReplyInputRef.current.value = "";
        } else {
            console.log("Their reply was undefined, setting messages to render to: ", [...messagesToRender, newMessages[controlIndexRef]])
            updatedMessages.push(...messagesToRender);
        }
        //check if the thread length has changed and if so insert a break.
        if (metadata.threads.length < threadsForSeparationOfMessages.current.length) {
            console.log("Threads length has changed, inserting a break")
            updatedMessages.push({ content: "BREAK", role: "eli" });
        }
        threadsForSeparationOfMessages.current = metadata.threads;
        updatedMessages.push(newMessages[controlIndexRef])
        setMessagesToRender(updatedMessages);
    }, [controlIndex, newMessages]);
    //spy and see if threads.length has changed, if it has then start a new general message else attach to the current general message
    return (
        <div className='px-[28px] w-full h-full flex flex-col overflow-y-scroll py-[14px]' style={{ pointerEvents: 'none' }} ref={scrollRef}>
            <div className="" style={{ pointerEvents: 'all' }}>

                <div className="h-[24vh] w-full"></div>
                {
                    ...getJsxFromAllMessages(messagesToRender)
                }
                {/* {
                theirReply && <><UserMessage text={theirReply.content as string} /> <EliMessage current={false} text='Loading...' eliResponseType='General' lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setNewMessageControlIndex={setNewMessageControlIndex} /></>
            } */}
                {
                    metadata.action == "ENDLESSON" && <EliMessage current={true} text={lessonState.metadata.subjects[0]} eliResponseType='System' systemMessagePosition='End' ctaText="Give Feedback"
                        lessonReplyInputRef={lessonReplyInputRef} updateState={updateState} setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} setControlIndex={setControlIndex}
                    />
                }
            </div>
        </div>
    )
}

export default Conversation
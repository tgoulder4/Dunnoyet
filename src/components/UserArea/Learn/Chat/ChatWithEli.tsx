'use client'
import { getEmbeddingForKnowledgeBase } from '@/app/(userArea)/learn/pineconeActions'
import { ILessonState, IMessage, IMessagesEndpointResponsePayload } from '@/lib/validation/enforceTypes'
import React, { ReactNode, createRef, use, useEffect, useRef, useState } from 'react'
import Conversation from './Conversation'
import { useSession } from 'next-auth/react'
import { ILesson } from '@/lib/validation/enforceTypes'
import NewButton from '@/components/ui/NewButton'
import { changeColour, colours, sizing, spacing } from '@/lib/constants'
import { merriweather } from '@/app/fonts'
import { Input } from '@/components/ui/input'
import { IMessagesEndpointSendPayload } from '@/lib/validation/enforceTypes'
import UserMessage from './UserMessage'
import Message from './Message'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

type chatProps = {
    isOpen: boolean,
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>,
    lessonID?: string,
    initialSubject?: string,
    updateState?: (formData: FormData | undefined, explicitState?: IMessagesEndpointResponsePayload) => Promise<void | null>,
    lessonState?: ILessonState,
    type: 'Tutorial' | 'Lesson' | 'NewQ'
}
function ChatWithEli({
    isOpen,
    setIsOpen,
    lessonID, initialSubject, updateState, lessonState, type
}: chatProps) {
    // const { data: session, update } = useSession();
    // if (!session) return <></>
    // const {
    //     id,
    //     name,
    // } = session?.user!!;
    const { id, name } = { id: "65dbe7799c9c2a30ecbe6193", name: "" }

    const nameInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [tutorialStage, setTutorialStage] = useState(-1);
    const [subject, setSubject] = useState(lessonState?.metadata.subjects[lessonState.metadata.subjects.length - 1] || 'New Question');
    const [disableInput, setDisableInput] = useState(false);
    const [updatingState, setUpdatingState] = useState(false);
    const router = useRouter();
    const [responseFromserver, setResponseFromServer] = useState(null as null | {
        type: 'error' | 'success',
        message: string
    });
    const [_type, setType] = useState(type);
    console.log("Type: ", _type)
    if (_type == "Lesson" && !lessonState || _type == 'Lesson' && !updateState) throw new Error("No lesson state found @ChatWithEli")
    // const Lesson: ILesson = {
    //     id: "",
    //     subjects: [""],
    //     messages: [{
    //         content: "",
    //         role: "user",
    //     },
    //     {
    //         content: "",
    //         role: "eli",
    //         eliResponseType: "General",
    //     },
    //     {
    //         content: "",
    //         role: "eli",
    //         eliResponseType: "WhatComesToMind",
    //     }
    //     ],
    //     beganAt: new Date(),
    //     lessonStatus: "Active",
    //     endedAt: new Date(),
    //     knowledgePointChain: [{
    //         source: "reinforced",
    //         pointInSolitude: "",
    //         pointInChain: "",
    //         TwoDCoOrdinates: [0, 0],
    //         vectorEmbedding: [0, 0],
    //         confidence: 0
    //     }]
    // }

    const tutorialStages: { glyph: ReactNode, titleText: string, summaryText: string, action: ReactNode, actionOrLink: () => void | string }[] = [{
        glyph: <svg width="114" height="95" viewBox="0 0 114 95" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.6559 78.9398C19.8399 77.9417 18.4325 76.6034 17.4337 74.9248C16.4349 73.2462 15.9355 71.3634 15.9355 69.2765V43.1447L2.86021 35.9312C1.86141 35.3868 1.13501 34.7063 0.681004 33.8897C0.227001 33.0731 0 32.1657 0 31.1676C0 30.1695 0.227001 29.2622 0.681004 28.4456C1.13501 27.6289 1.86141 26.9484 2.86021 26.404L48.8961 1.36103C49.7133 0.907354 50.5532 0.567096 51.4158 0.340258C52.2784 0.113419 53.1637 0 54.0717 0C54.9797 0 55.865 0.113419 56.7276 0.340258C57.5902 0.567096 58.4301 0.907354 59.2473 1.36103L111.14 29.6705C112.048 30.1242 112.751 30.782 113.251 31.644C113.75 32.506 114 33.436 114 34.4341V69.2765C114 70.819 113.478 72.112 112.434 73.1554C111.389 74.1989 110.096 74.7206 108.552 74.7206C107.008 74.7206 105.714 74.1989 104.67 73.1554C103.626 72.112 103.104 70.819 103.104 69.2765V37.1562L92.2079 43.1447V69.2765C92.2079 71.3634 91.7085 73.2462 90.7097 74.9248C89.7109 76.6034 88.3035 77.9417 86.4874 78.9398L59.2473 93.639C58.4301 94.0926 57.5902 94.4329 56.7276 94.6597C55.865 94.8866 54.9797 95 54.0717 95C53.1637 95 52.2784 94.8866 51.4158 94.6597C50.5532 94.4329 49.7133 94.0926 48.8961 93.639L21.6559 78.9398ZM54.0717 51.3109L91.3907 31.1676L54.0717 11.0244L16.7527 31.1676L54.0717 51.3109ZM54.0717 84.1117L81.3118 69.4126V48.861L59.3835 60.9742C58.5663 61.4279 57.7037 61.7681 56.7957 61.995C55.8877 62.2218 54.9797 62.3352 54.0717 62.3352C53.1637 62.3352 52.2557 62.2218 51.3477 61.995C50.4397 61.7681 49.5771 61.4279 48.7599 60.9742L26.8315 48.861V69.4126L54.0717 84.1117Z" fill="white" />
        </svg>,
        titleText: "I'm Eli, your new tutor!",
        summaryText: "What should I call you?",
        action: <Input className='h-14 bg-white' ref={nameInputRef} placeholder="Your name..." />,
        actionOrLink:
            //set name in session
            async () => {
                if (nameInputRef.current?.value) {
                    console.log("Setting name in session to ", nameInputRef.current?.value)
                    //WHILE AUTH ISN'T WORKING;
                    // await update({ ...session, user: { ...session.user, name: nameInputRef.current?.value } })
                    setTutorialStage(1);
                } else {
                    nameInputRef.current?.focus();
                }
            }

    },
    {
        glyph: <svg width="112" height="107" viewBox="0 0 112 107" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.25 107C24.3958 107 21.1198 105.643 18.4219 102.929C15.724 100.216 14.375 96.9203 14.375 93.0435C14.375 89.1667 15.724 85.8714 18.4219 83.1576C21.1198 80.4438 24.3958 79.087 28.25 79.087C29.3292 79.087 30.3313 79.2033 31.2563 79.4359C32.1812 79.6685 33.0677 79.9786 33.9156 80.3663L40.5063 72.1087C38.3479 69.7051 36.8448 66.9913 35.9969 63.9674C35.149 60.9435 34.9562 57.9196 35.4188 54.8957L26.0531 51.7554C24.7427 53.6938 23.0854 55.2446 21.0813 56.4076C19.0771 57.5707 16.8417 58.1522 14.375 58.1522C10.5208 58.1522 7.24479 56.7953 4.54688 54.0815C1.84896 51.3678 0.5 48.0725 0.5 44.1957C0.5 40.3188 1.84896 37.0236 4.54688 34.3098C7.24479 31.596 10.5208 30.2391 14.375 30.2391C18.2292 30.2391 21.5052 31.596 24.2031 34.3098C26.901 37.0236 28.25 40.3188 28.25 44.1957V45.1261L37.6156 48.3826C39.1573 45.5913 41.2193 43.2264 43.8016 41.288C46.3839 39.3496 49.2938 38.1091 52.5312 37.5663V27.4478C49.525 26.5949 47.0391 24.9473 45.0734 22.5049C43.1078 20.0625 42.125 17.213 42.125 13.9565C42.125 10.0797 43.474 6.78442 46.1719 4.07065C48.8698 1.35688 52.1458 0 56 0C59.8542 0 63.1302 1.35688 65.8281 4.07065C68.526 6.78442 69.875 10.0797 69.875 13.9565C69.875 17.213 68.8729 20.0625 66.8688 22.5049C64.8646 24.9473 62.3979 26.5949 59.4688 27.4478V37.5663C62.7062 38.1091 65.6161 39.3496 68.1984 41.288C70.7807 43.2264 72.8427 45.5913 74.3844 48.3826L83.75 45.1261V44.1957C83.75 40.3188 85.099 37.0236 87.7969 34.3098C90.4948 31.596 93.7708 30.2391 97.625 30.2391C101.479 30.2391 104.755 31.596 107.453 34.3098C110.151 37.0236 111.5 40.3188 111.5 44.1957C111.5 48.0725 110.151 51.3678 107.453 54.0815C104.755 56.7953 101.479 58.1522 97.625 58.1522C95.1583 58.1522 92.9036 57.5707 90.8609 56.4076C88.8182 55.2446 87.1802 53.6938 85.9469 51.7554L76.5813 54.8957C77.0438 57.9196 76.851 60.9241 76.0031 63.9092C75.1552 66.8944 73.6521 69.6275 71.4938 72.1087L78.0844 80.25C78.9323 79.8623 79.8187 79.5716 80.7438 79.3777C81.6688 79.1839 82.6708 79.087 83.75 79.087C87.6042 79.087 90.8802 80.4438 93.5781 83.1576C96.276 85.8714 97.625 89.1667 97.625 93.0435C97.625 96.9203 96.276 100.216 93.5781 102.929C90.8802 105.643 87.6042 107 83.75 107C79.8958 107 76.6198 105.643 73.9219 102.929C71.224 100.216 69.875 96.9203 69.875 93.0435C69.875 91.4928 70.1255 90.0002 70.6266 88.5658C71.1276 87.1313 71.8021 85.8326 72.65 84.6696L66.0594 76.412C62.899 78.1953 59.5266 79.087 55.9422 79.087C52.3578 79.087 48.9854 78.1953 45.825 76.412L39.35 84.6696C40.1979 85.8326 40.8724 87.1313 41.3734 88.5658C41.8745 90.0002 42.125 91.4928 42.125 93.0435C42.125 96.9203 40.776 100.216 38.0781 102.929C35.3802 105.643 32.1042 107 28.25 107ZM14.375 48.8478C15.6854 48.8478 16.7839 48.402 17.6703 47.5103C18.5568 46.6187 19 45.5138 19 44.1957C19 42.8775 18.5568 41.7726 17.6703 40.881C16.7839 39.9893 15.6854 39.5435 14.375 39.5435C13.0646 39.5435 11.9661 39.9893 11.0797 40.881C10.1932 41.7726 9.75 42.8775 9.75 44.1957C9.75 45.5138 10.1932 46.6187 11.0797 47.5103C11.9661 48.402 13.0646 48.8478 14.375 48.8478ZM28.25 97.6956C29.5604 97.6956 30.6589 97.2498 31.5453 96.3581C32.4318 95.4665 32.875 94.3616 32.875 93.0435C32.875 91.7254 32.4318 90.6205 31.5453 89.7288C30.6589 88.8371 29.5604 88.3913 28.25 88.3913C26.9396 88.3913 25.8411 88.8371 24.9547 89.7288C24.0682 90.6205 23.625 91.7254 23.625 93.0435C23.625 94.3616 24.0682 95.4665 24.9547 96.3581C25.8411 97.2498 26.9396 97.6956 28.25 97.6956ZM56 18.6087C57.3104 18.6087 58.4089 18.1629 59.2953 17.2712C60.1818 16.3795 60.625 15.2746 60.625 13.9565C60.625 12.6384 60.1818 11.5335 59.2953 10.6418C58.4089 9.75018 57.3104 9.30435 56 9.30435C54.6896 9.30435 53.5911 9.75018 52.7047 10.6418C51.8182 11.5335 51.375 12.6384 51.375 13.9565C51.375 15.2746 51.8182 16.3795 52.7047 17.2712C53.5911 18.1629 54.6896 18.6087 56 18.6087ZM56 69.7826C59.2375 69.7826 61.974 68.6583 64.2094 66.4098C66.4448 64.1612 67.5625 61.4087 67.5625 58.1522C67.5625 54.8957 66.4448 52.1431 64.2094 49.8946C61.974 47.646 59.2375 46.5217 56 46.5217C52.7625 46.5217 50.026 47.646 47.7906 49.8946C45.5552 52.1431 44.4375 54.8957 44.4375 58.1522C44.4375 61.4087 45.5552 64.1612 47.7906 66.4098C50.026 68.6583 52.7625 69.7826 56 69.7826ZM83.75 97.6956C85.0604 97.6956 86.1589 97.2498 87.0453 96.3581C87.9318 95.4665 88.375 94.3616 88.375 93.0435C88.375 91.7254 87.9318 90.6205 87.0453 89.7288C86.1589 88.8371 85.0604 88.3913 83.75 88.3913C82.4396 88.3913 81.3411 88.8371 80.4547 89.7288C79.5682 90.6205 79.125 91.7254 79.125 93.0435C79.125 94.3616 79.5682 95.4665 80.4547 96.3581C81.3411 97.2498 82.4396 97.6956 83.75 97.6956ZM97.625 48.8478C98.9354 48.8478 100.034 48.402 100.92 47.5103C101.807 46.6187 102.25 45.5138 102.25 44.1957C102.25 42.8775 101.807 41.7726 100.92 40.881C100.034 39.9893 98.9354 39.5435 97.625 39.5435C96.3146 39.5435 95.2161 39.9893 94.3297 40.881C93.4432 41.7726 93 42.8775 93 44.1957C93 45.5138 93.4432 46.6187 94.3297 47.5103C95.2161 48.402 96.3146 48.8478 97.625 48.8478Z" fill="white" />
        </svg>
        ,
        titleText: name + ", I learn how you think",
        summaryText: "Using research on confirmation and anchoring bias, I'll help you learn more effectively.",
        action: <NewButton buttonVariant="ghost" className='outline-2 outline-white text-white rounded-[10px] border-white border-1 bg-transparent'>Learn more</NewButton>,
        actionOrLink: () => {
            setTutorialStage(2);
        }
    },
    {
        glyph: <svg width="64" height="89" viewBox="0 0 64 89" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.9933 72.1266L49.2727 44.3136H31.279L34.5403 18.8557L13.7351 48.7996H29.3671L25.9933 72.1266ZM19.0207 57.7715H5.07561C3.27624 57.7715 1.94545 56.9678 1.08325 55.3603C0.221053 53.7528 0.314771 52.2014 1.3644 50.7061L34.9902 2.48191C35.7399 1.43519 36.7146 0.706216 37.9142 0.295001C39.1137 -0.116213 40.3508 -0.0975211 41.6254 0.351076C42.8999 0.799673 43.8371 1.58472 44.4369 2.70621C45.0367 3.8277 45.2616 5.02396 45.1116 6.29499L41.5129 35.3417H58.9443C60.8936 35.3417 62.2619 36.2015 63.0491 37.9211C63.8364 39.6407 63.5927 41.2482 62.3181 42.7435L25.3185 86.9303C24.4938 87.9023 23.4817 88.5378 22.2821 88.8369C21.0825 89.1359 19.9204 89.0238 18.7958 88.5004C17.6712 87.9771 16.7903 87.1733 16.153 86.0892C15.5157 85.0051 15.2721 83.8275 15.422 82.5565L19.0207 57.7715Z" fill="white" />
        </svg>
        ,
        titleText: "Learn at Lightspeed",
        summaryText: "You'll learn faster than ever before by visualizing your knowledge, creating links between concepts.",
        action: <></>,
        actionOrLink: () => {
            console.log("End of tutorial, redirecting to /learn/lesson/new");
            // redirect('/learn/lesson/new');
            router.push('/learn/lesson/new');
        }
    }
    ]
    useEffect(() => {
        textAreaRef.current?.focus();

        if (_type == "Tutorial") {
            setSubject("Eli - Welcome");
            setTutorialStage(0);
            nameInputRef.current?.focus();
        }
        else if (type == 'Lesson') {
            setSubject("Eli - " + subject || "In Lesson");

        }
    }, []);
    async function submitUserQuestion(data: FormData) {

        //make a POST request to /lesson/new with the user's reply as 'newQuestin' key in the body.
        console.log("Submitting user reply with data ", data.get('newQuestion'))
        const newQuestion = data.get('userInput');
        if (!newQuestion) {
            console.error("No new question found in form data")
            return;
        };
        console.log("POSTing new question to /lesson/new with newQuestion: ", newQuestion)
        // const res = await fetch('/api/lessons/new', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ newQuestion })
        // });
        // const response = await res.json();
        const response: any = await new Promise<IMessagesEndpointResponsePayload | {
            error: string
        }>((resolve, reject) => {
            setTimeout(() => {
                resolve({

                    newMessages: [
                        {
                            content: '\n' +
                                "As you know about the de-brogile equation, we’ll start with that.",
                            role: 'eli',
                            eliResponseType: 'SubjectIntroduction'
                        },
                        {
                            splitResponse: {
                                text: 'Electrons exhibit wave-like behavior due to their wave-particle duality.',
                                active: true
                            },
                            role: 'eli',
                            eliResponseType: 'General'
                        }
                    ],
                    metadata: {
                        lessonID: '65dbe7799c9c2a30ecbe6193',
                        threads: [
                            [
                                {
                                    splitResponse: {
                                        text: 'Electrons exhibit wave-like behavior due to their wave-particle duality.',
                                        active: true
                                    },
                                    role: 'eli',
                                    eliResponseType: 'General'
                                },
                                {
                                    splitResponse: {
                                        text: '[Wave-particle duality] is a fundamental concept in quantum mechanics.',
                                        active: false
                                    },
                                    role: 'eli',
                                    eliResponseType: 'General'
                                },
                                {
                                    splitResponse: {
                                        text: 'This means that electrons can behave like particles in some situations and like waves in others.',
                                        active: false
                                    },
                                    role: 'eli',
                                    eliResponseType: 'General'
                                },
                                {
                                    splitResponse: {
                                        text: 'The wavelength of an electron can be calculated using the [de Broglie wavelength equation].',
                                        active: false
                                    },
                                    role: 'eli',
                                    eliResponseType: 'General'
                                },
                                {
                                    splitResponse: {
                                        text: 'Understanding this duality helps explain various phenomena in the microscopic world.',
                                        active: false
                                    },
                                    role: 'eli',
                                    eliResponseType: 'General'
                                }
                            ]
                        ],
                        subjects: ['\nExplaining electrons exhibiting wave-like behavior\n'],
                        knowledgePointChain: [
                            {
                                confidence: 5,
                                lessonId: '65dbe7799c9c2a30ecbe6193',
                                pointInSolitude: 'Electrons exhibit wave-like behavior due to wave-particle duality.',
                                pointInChain: '',
                                source: 'offered',
                                TwoDCoOrdinates: [63.142, 31.1415],
                                vectorEmbedding: [
                                    -0.022827767, 0.0018153265, -0.037418827, 0.05640204,
                                    0.018287312, 0.054166034, -0.0005283413, 0.050606683,
                                    0.008151144, 0.0446288, 0.004771471, -0.001528696,
                                    0.016712982, 0.033243436, 0.00013609602, 0.046956066,
                                    -0.01811619, -0.0023201385, 0.009063798, 0.03157784,
                                    -0.019450946, -0.017876618, 0.028908327, -0.00036488348,
                                    0.012024221, -0.025348974, -0.020329375, 0.0075408067,
                                    0.004754359, 0.02206342, 0.013427427, -0.01878927,
                                    0.026147546, -0.018766455, -0.051884398, 0.05370971,
                                    -0.02788159, 0.0047400985, -0.023078747, 0.020751478,
                                    -0.024527585, -0.019895865, -0.03089335, 0.045199208,
                                    -0.0331978, 0.0068277954, -0.04380741, -0.06128474,
                                    0.044218104, 0.044240918, 0.032034166, 0.035479438,
                                    0.050789215, -0.029912246, -0.020511907, -0.010472708,
                                    0.010866291, 0.041343242, -0.0084249405, -0.002026378,
                                    0.040704384, -0.0019893013, -0.007523694, 0.039084423,
                                    -0.010814954, -0.030710818, -0.045085125, -0.016085533,
                                    0.0006887688, 0.0032969639, 0.027927224, 0.0064570294,
                                    -0.042712223, 0.04136606, 0.03810332, -0.036871236,
                                    -0.01435149, -0.054896157, 0.011488036, 0.03954075,
                                    0.0017725459, -0.042347163, 0.01096326, -0.020158254,
                                    -0.016655942, 0.02888551, 0.034794945, -0.01998713,
                                    -0.032285146, -0.012902651, 0.04040777, 0.06712573,
                                    -0.026352894, 0.010512637, -0.020568946, 0.021413153,
                                    0.040019892, -0.007113, -0.067901485, -0.002683774,
                                ]
                            },
                            {
                                confidence: 4,
                                lessonId: '65dbe7799c9c2a30ecbe6193',
                                pointInSolitude: 'Electrons can act as waves in quantum mechanics.',
                                pointInChain: '',
                                source: 'offered',
                                TwoDCoOrdinates: [32.642, 35.3415],
                                vectorEmbedding: [
                                    -0.027314743, 0.029712684, -0.060951333, 0.048351236, 0.027096748,
                                    0.026072172, -0.05367031, 0.059294574, -0.012567397, 0.024262816,
                                    0.00030672541, 0.004599689, -0.0075044692, 0.025287392, 0.020284412,
                                    0.026115771, -0.042552575, -0.0047114114, 0.015314131, 0.052536733,
                                    0.0045342906, -0.015543026, 0.03457397, 0.004733211, 0.010164006,
                                    -0.048438434, -0.020556904, 0.058291797, 0.024720605, 0.021952072,
                                    0.03071546, -0.031849034, -0.0069594826, -0.008180253, -0.038040083,
                                    0.021995671, -0.027336542, -0.014758245, -0.01326498, 0.00090604066,
                                    -0.010414699, -0.009357424, -0.041353606, 0.055937454, -0.030453866,
                                    -0.014605648, -0.041724194, -0.024764204, 0.054149896, 0.041985787,
                                    0.040568825, 0.04059062, 0.020840298, 0.0077824127, -0.02363063,
                                    -0.018856546, -0.00994601, 0.018573152, 0.028077723, -0.004286322,
                                    0.014376754, 0.026486361, 0.0003099613, 0.031042453, -0.037189905,
                                    0.011989712, -0.026856953, -0.02363063, -0.013384878, 0.031282246,
                                    0.013548374, 0.009302926, -0.052100744, 0.051359564, 0.012087809,
                                    -0.025178393, -0.0055915653, -0.025178393, -0.0076679653, 0.004531566,
                                    0.01451845, -0.03359299, 0.0032208725, -0.054062698, -0.019368833,
                                    0.060384545, -0.0052236994, -0.012796292, -0.06962752, -0.03782209,
                                    0.022933047, 0.054716684, -0.033941783, 0.027074948, -0.020273512,
                                    0.036317926, 0.040983014, -0.014431252, -0.028753508, -0.03363659,
                                ]
                            },
                            {
                                confidence: 2,
                                lessonId: '65dbe7799c9c2a30ecbe6193',
                                pointInSolitude: 'Electrons can exhibit wave-like behavior in certain situations.',
                                pointInChain: '',
                                source: 'offered',
                                TwoDCoOrdinates: [41.842, 3.8415],
                                vectorEmbedding: [
                                    -0.029410908, 0.021849506, -0.050965812, 0.060343914,
                                    0.009052815, 0.04964011, -0.0055575077, 0.029779157,
                                    0.019910054, 0.06657962, 0.01894033, 0.008175152,
                                    0.029361807, 0.014410853, 0.015233279, 0.060049314,
                                    -0.03378081, 0.0090159895, -0.014337203, 0.03996741,
                                    0.0014522863, -0.0033388007, 0.022806956, 0.020327404,
                                    -0.0061282953, -0.020597454, -0.026366707, 0.019811856,
                                    0.02232823, 0.025703857, 0.023162931, -0.03218506,
                                    -0.00088303303, -0.04433731, -0.07860912, 0.05425551,
                                    -0.01795833, 0.0019916194, -0.023739856, 0.010832691,
                                    -0.0150123285, -0.017369129, -0.04222601, 0.061473217,
                                    0.0014008847, 0.003212982, -0.032356907, -0.04941916,
                                    0.03812616, 0.052978914, 0.03135036, 0.055483013,
                                    0.03910816, 0.009267627, -0.018019704, -0.024009906,
                                    0.01879303, 0.05209511, 0.027250506, -0.013441129,
                                    0.036628608, -0.0002873118, 0.02318748, 0.04666956,
                                    -0.027127756, 0.01999598, -0.056514114, -0.028453456,
                                    -0.004259426, 0.02161628, 0.013023778, -0.0020453224,
                                    -0.03913271, 0.046620462, 0.03272516, -0.016227555,
                                    -0.0032897007, -0.054550115, 0.022831505, 0.029779157,
                                    0.02056063, -0.04612946, -0.01061174, -0.04092486,
                                    -0.0045724385, 0.049198214, 0.012986953, -0.015687454,
                                    -0.03856806, -0.019713655, 0.016203005, 0.05238971,
                                    -0.027815158, 0.03576936, -0.02470958, 0.02242643,
                                    0.010581053, -0.028036106, -0.03373171, 0.013195628,
                                ]
                            },
                            {
                                confidence: 2,
                                lessonId: '65dbe7799c9c2a30ecbe6193',
                                pointInSolitude: 'Electrons have wave-like behavior, described by de Broglie equation.',
                                pointInChain: '',
                                source: 'offered',
                                TwoDCoOrdinates: [43.029, 14.3415],
                                vectorEmbedding: [
                                    -0.02821991, 0.01956654, -0.049869873, 0.03256313, 0.011883228,
                                    0.040301558, -0.021749172, 0.011420245, -0.005249895, 0.05507292,
                                    -0.0031995426, 0.00096179184, -0.0068786032, -0.017086273, -0.0061510587,
                                    0.042550333, -0.0152012715, 0.004056612, 0.008526602, 0.04656285,
                                    0.007606148, -0.011486385, 0.02429558, 0.025993183, 0.009612407,
                                    -0.017306741, -0.024670374, 0.018353965, 0.016237471, 0.022190109,
                                    0.017251624, -0.027492365, 0.007446308, -0.028859267, -0.04393928,
                                    0.037876412, -0.021683032, -0.004946752, -0.028308097, 0.0076006358,
                                    -0.018960252, -0.038163017, -0.059438184, 0.035517402, -0.02128619,
                                    0.021649962, -0.04704788, -0.04704788, 0.055381574, 0.027778974,
                                    0.016942969, 0.038052786, 0.04704788, -0.003723154, -0.026610494,
                                    -0.009838386, 0.04656285, 0.05533748, 0.009094307, 0.0025023124,
                                    0.052912332, 0.021021629, -0.012654866, 0.013702089, -0.034459155,
                                    -0.01662329, -0.03809688, -0.033422954, -0.026478212, 0.011927322,
                                    0.006217199, 0.02718371, -0.04490934, 0.01386744, -0.0076502413,
                                    -0.036663838, -0.03234266, -0.06569948, 0.020591715, 0.028749034,
                                    0.021175956, -0.043784954, -0.002968051, -0.04199916, -0.03855986,
                                    0.03139465, 0.04907619, -0.012676912, -0.040257465, -0.0054290257,
                                    -0.0021123595, 0.07156393, -0.050575368, 0.029476577, -0.006101453,
                                    0.012555655, 0.037060678, -0.006283339, -0.018155543, -0.020029522,
                                ]
                            },
                            {
                                confidence: 2,
                                lessonId: '65dbe7799c9c2a30ecbe6193',
                                pointInSolitude: 'Electrons behave like waves, explaining phenomena in the microscopic world.',
                                pointInChain: '',
                                source: 'offered',
                                TwoDCoOrdinates: [23.142, 13.1415],
                                vectorEmbedding: [
                                    -0.02287109, 0.019203713, -0.06841323, 0.038051803,
                                    0.004867608, 0.03009471, -0.025916124, 0.03789622,
                                    -0.018147955, 0.018870316, -0.019414866, 0.014136068,
                                    -0.017414479, -0.018970335, 0.018570257, 0.036207,
                                    -0.04549769, 0.019414866, 0.012457965, 0.04036336,
                                    0.02491593, -0.0056816544, 0.047031317, 0.024649212,
                                    0.037473913, -0.042430427, -0.04096348, 0.04707577,
                                    0.011352195, 0.013702651, 0.03276189, -0.011113261,
                                    -0.0007494505, -0.008496088, -0.023715697, 0.030183615,
                                    -0.0080737835, -0.029494593, 0.0051982277, 0.03889641,
                                    -0.0132914595, 0.0009098982, -0.054543883, 0.04216371,
                                    -0.028761119, -0.001066873, -0.050498657, -0.046364523,
                                    0.04956514, 0.06227871, 0.034273297, 0.019748263,
                                    0.05160998, -0.004887056, -0.0074458844, 0.008234926,
                                    0.013524838, 0.016014209, -0.0061067366, 0.003764617,
                                    -0.004603668, 0.009401819, -0.028338814, 0.04369734,
                                    -0.02331562, -0.009274016, -0.047964834, -0.00027036478,
                                    -0.010235313, 0.016414287, 0.014202747, -0.021970917,
                                    -0.07965985, 0.03507345, 0.024715891, -0.021904236,
                                    -0.0018836977, -0.04387515, -0.013358139, 0.019548224,
                                    0.018225746, -0.0467646, 0.0075514605, -0.029405687,
                                    -0.025004836, 0.030783731, 0.04934288, -0.021181874,
                                    -0.0212041, -0.030894864, 0.011402206, 0.055566303,
                                    -0.050632015, 0.011379979, -0.032184, 0.04623116,
                                    0.004928731, -0.005687211, -0.009262903, -0.0025421584,
                                ]
                            }
                        ],
                        currentKnowledgePointIndex: 1
                    }

                } as IMessagesEndpointResponsePayload)
            }, 1000);
        })
        console.log("recieved response from /lesson/new: ", response)
        if (response.error) {
            console.error("Error from /lesson/new: ", response.error)
            setResponseFromServer({ type: 'error', message: response.error })
            return;
        }
        console.log("response: ", response)
        console.log("Response from /api/lessons/new: ")
        console.dir(response, { depth: null });
        if (!updateState) throw new Error("No updateState function found in ChatWithEli, can't start the lesson.")
        console.log("Updating state with response");
        await updateState(data, response);
        setType('Lesson');
    }
    function handleSumbitAction(data: FormData) {
        setDisableInput(true);
        if (_type == "NewQ") submitUserQuestion(data);
        else if (_type == "Lesson") updateState!(data);
        else if (_type == "Tutorial") null;
        else null;
        setDisableInput(false);
    }
    return (<div style={{ right: sizing.variableWholePagePadding }} className='flex flex-col bottom-0  z-10 w-full max-w-[600px] fixed rounded-t-[10px] shadow-[0px_0px_0px_2px_#131313]'>
        <div className='p-4 px-6 bg-white rounded-t-[20px] font-bold'>{subject}</div>
        <form action={handleSumbitAction}>
            {
                isOpen ? <>
                    <div className='h-[60vh] w-full flex flex-col items-center' style={{ backgroundColor: type == 'Tutorial' ? changeColour(colours.primary).darken(8).toString() : type == "NewQ" ? colours.complementary_lightest : changeColour(colours.complementary_lightest).lighten(8).toString(), paddingTop: 0 }}>
                        {_type == "NewQ" && <>
                            <div className="w-full px-8 pt-9 flex items-center justify-center">
                                <Message className='w-full h-48 ' style={{ marginBottom: spacing.gaps.groupedElement, borderBottomRightRadius: 0, backgroundColor: changeColour(colours.primary).darken(2).toString() }}>
                                    <textarea ref={textAreaRef} placeholder='Ask a question...' style={{ fontFamily: merriweather.style.fontFamily, fontSize: sizing.largerFontSize + 'rem', fontWeight: 600 }} id="userInput" name="userInput" className='resize-none text-start bg-transparent active:border-transparent border-opacity-5 border-black !placeholder-[#0F291B] text-white flex w-full rounded-md border-2 border-input px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent disabled:cursor-not-allowed disabled:opacity-50'></textarea>
                                </Message>
                            </div>
                        </>}
                        {_type == "Lesson" && <Conversation setDisableInput={setDisableInput} setUpdatingState={setUpdatingState} updateState={updateState!} oldMessages={lessonState!.oldMessages} newMessages={lessonState?.newMessages!} />}

                        {
                            _type == "Tutorial" &&
                            <div className='h-full w-4/5 flex flex-col  items-center' style={{ paddingTop: 2 * spacing.gaps.largest, rowGap: spacing.gaps.separateElement }}>
                                <div className="flex flex-col items-center" style={{ rowGap: spacing.gaps.groupedElement }}>
                                    {tutorialStages[tutorialStage].glyph}
                                    <h1 className='text-white font-bold text-center' style={{ fontFamily: merriweather.style.fontFamily, fontSize: sizing.largerFontSize + 'rem' }}>{tutorialStages[tutorialStage].titleText}</h1>
                                    <p className='text-white text-center'>{tutorialStages[tutorialStage].summaryText}</p>
                                </div>
                                {tutorialStages[tutorialStage].action}
                            </div>
                        }

                    </div>
                    <div style={{ columnGap: spacing.gaps.groupedElement }} className="p-8 pb-16 flex flex-row h-max bg-white">
                        {
                            type == "Lesson" && <Input disabled={disableInput} id="userInput" name="userInput" type="text" placeholder="Type your reply..." className='rounded-[20px] w-full flex-1' />
                        }
                        <NewButton disabled={disableInput} tooltip='Ask Question' type={_type == "Tutorial" ? 'button' : 'submit'} buttonVariant='black' className='h-14' style={{ borderRadius: _type == "Lesson" ? 999 : 10, width: _type == "Lesson" ? '5rem' : '100%' }} actionOrLink={tutorialStage !== -1 ? tutorialStages[tutorialStage].actionOrLink :
                            () => { }}>{_type == "Tutorial" ? tutorialStage == tutorialStages.length - 1 ? "Ask my first question" : 'Continue' : _type == "NewQ" ? "Ask question" : ""}
                            {_type == "Lesson" &&

                                <svg strokeWidth={1} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" fill='white' width="24"><path d="M120-40q-17 0-28.5-11.5T80-80q0-17 11.5-28.5T120-120h720q17 0 28.5 11.5T880-80q0 17-11.5 28.5T840-40H120Zm80-120q-17 0-28.5-11.5T160-200v-200q-33-54-51-114.5T91-638q0-61 15.5-120T143-874q8-21 26-33.5t40-12.5q31 0 53 21t18 50l-11 91q-6 48 8.5 91t43.5 75.5q29 32.5 70 52t89 19.5q60 0 120.5 12.5T706-472q45 23 69.5 58.5T800-326v126q0 17-11.5 28.5T760-160H200Zm40-80h480v-86q0-24-12-42.5T674-398q-41-20-95-31t-99-11q-66 0-122.5-27t-96-72.5Q222-585 202-644.5T190-768q-10 30-14.5 64t-4.5 66q0 58 20.5 111.5T240-422v182Zm240-320q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-720q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720q0 33 23.5 56.5T480-640ZM320-160v-37q0-67 46.5-115T480-360h120q17 0 28.5 11.5T640-320q0 17-11.5 28.5T600-280H480q-34 0-57 24.5T400-197v37h-80Zm160-80Zm0-480Z" /></svg>
                            }
                            {updatingState && <Loader2 size={20} fill='white' className='animate-spin' />}
                        </NewButton>
                    </div>
                </>

                    : <></>
            }
        </form>
    </div>
    )
}

export default ChatWithEli
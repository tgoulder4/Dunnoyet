'use client'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { changeColour, colours, responsiveFont, sizing, spacing, uiBorder } from '@/lib/constants'
import { Loader2, Plus, Send } from 'lucide-react'
import { merriweather, ruda } from '@/app/fonts'
import { Button } from "@/components/ui/button"
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
import { Input } from "@/components/ui/input"
import SwitcherButton from '@/components/UserArea/Home/SwitcherButton'
import { Textarea } from '@/components/ui/textarea'
import NeuralNetwork from '@/components/UserArea/Learn/Lesson/Network/NeuralNetwork'
import Stat from '@/components/UserArea/Learn/Lesson/Stat'
import { Toaster, toast } from 'sonner'
import { client } from '@/lib/db/hono'
import { z } from 'zod'
import { userHomeInfoSchema } from '@/lib/validation/general/types'
import axios from 'axios'
// import { useSearchParams } from 'next/navigation'
import { experiencePerKnowledgePoint } from '@/lib/chat/Eli/helpers/constants'
import { Metadata } from 'next'
import SubmitButton from './SubmitButton'
var equal = require('deep-equal');
// export const metadata: Metadata = {
//     title: "Dunnoyet - Learn",
// }
// export async function createNewLesson() { }
function Page({ params }: { params: { params: string } }) {
    const modeDetails = [{
        modeTitle: "New Question",
        inputPlaceholder: "Ask anything",
        modeDescription: "New Question: Link what you know to target knowledge.",
        examples: ["What is the spinal cavity?", "Why do electrons repel each other?", "What causes things to fall?", "What do plants need to grow?"]
    }, {
        modeTitle: "Free Roam",
        inputPlaceholder: "State something you know",
        modeDescription: "Free Roam: Learn unlimited information around something you know.",
        examples: ["The spinal cavity holds the spinal cord", "Electrons are negatively charged", "Gravity makes things fall", "Plants need sunlight to grow"]

    }];
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [mode, setMode] = useState(0);
    const [userInfo, setUserInfo] = useState(null as null | z.infer<typeof userHomeInfoSchema>);
    const [submitting, isSubmitting] = useState(false)
    const loading = userInfo == null;
    const initialised = useRef(false);
    const {
        knowledgePoints,
        isPremium,
        name,
    } = userInfo ?? {};
    let KPs = knowledgePoints;
    if (!knowledgePoints || !knowledgePoints.length) KPs = [
        {
            confidence: -1,
            KP: 'Loading...',
            TwoDvK: [],
        },
    ];
    const handleSetMode = (mode: number) => {
        const ta = textAreaRef.current;
        setMode(mode);
        if (ta) ta.value = '';
        ta?.focus();
    }
    const handleSubmit = async (e:
        React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();
        console.log("submitted")
        if (!textAreaRef.current) {
            toast.error("Something went wrong. Please reload the page and try again.")
        } else if (!textAreaRef.current.value) {
            toast.error("Please" + (mode == 0 ? " ask a question" : " state something you know") + " before submitting.")
        } else {
            window.location.href = '/lesson/new?' + (mode == 0 ? "q=" : "uKP=") + textAreaRef.current?.value;
            //make them wait 3s
            // await new Promise((res) => setTimeout(res, 3000));
        }
        isSubmitting(false)
        //lesson/loading?q/uKP=... makes a new lesson
    }
    useEffect(() => {
        //gather exampleSayings, stats, experience, and knowledgePoints
        async function main() {
            // try {
            // if (!showcaseMode) {
            // const sess = await axios.get('/api2/uth/session');
            // if (!sess.data.user) {
            //     toast.error("You need to be logged in to access this page.")
            //     window.location.href = '/auth/login';
            //     return;
            // }
            // const userID = '65dbe7799c9c2a30ecbe6193'
            const res = await axios.get(`/api/users/65dbe7799c9c2a30ecbe6193`);
            // console.log("Response from /a/api2/rs/:id ", res.data)
            // const json = await res.json()
            const json = await res.data;
            console.log("res.data: ", json)
            const userInfo = userHomeInfoSchema.safeParse(json);
            if (!userInfo.success) {
                toast.error("Something went wrong. Please reload the page and try again.")
                console.error("Failed to parse user info: ", userInfo.error.message)
            } else {
                setUserInfo(userInfo.data);
            }
            // } 
            // else {
            //     setUserInfo({
            //         id: "mock",
            //         experience: experiencePerKnowledgePoint * 3,
            //         isPremium: false,
            //         knowledgePoints: [{
            //             confidence: 2,
            //             KP: "Mitochondria is the powerhouse of the cell",
            //             TwoDvK: [10, 20],
            //         },
            //         {
            //             confidence: 2,
            //             KP: "Photons are particles of light",
            //             TwoDvK: [80.73157922699662, 0.399578771299815]
            //         },
            //         {
            //             confidence: 2,
            //             KP: "Momentum is conserved in a closed system",
            //             TwoDvK: [120.73157922699662, 48.399578771299815]
            //         }
            //         ],
            //         name: "Guest"
            //     })

            // }
            // } catch (e) {
            //     console.error(e)
            //     toast.error("Something went wrong. Please reload the page and try again.")
            //     window.location.href = '/ap/api2/r&err=getuserinfofailed'
            // }
        }
        if (!initialised.current) {
            initialised.current = true;
            main()
        }
    })
    return (
        <>
            <title>Home - Dunnoyet</title>
            <div className={` flex flex-col`} style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
                <MainAreaNavbar style="normal" show={{ userSide: { newQuestion: false } }} />
                <main className="flex flex-col items-center bg-white h-[100vh]" >
                    {/* switcher */}
                    <div className="switcher w-full flex flex-col items-center px-12 md:px-16" style={{ paddingTop: spacing.gaps.separateElement, borderBottom: uiBorder(0.2) }}>
                        <div className="transition-all switcherButtons flex flex-row max-w-5xl w-full">
                            <SwitcherButton text="New Question" setMode={handleSetMode} mode={mode} />
                            <SwitcherButton text="Free Roam" setMode={handleSetMode} mode={mode} />
                        </div>
                    </div>
                    <section
                        className='transition-all flex flex-col items-center w-full py-14 px-12 md:px-16'
                        style={{ borderBottom: uiBorder(0.2), rowGap: spacing.gaps.largest - 10 }}>
                        <div className="flex flex-col items-center gap-3 w-full max-w-5xl">
                            <h1 className='font-black'>{modeDetails[mode].modeDescription}</h1>
                            <form onSubmit={data => { isSubmitting(true); handleSubmit(data) }} className="animate-in slide-in-from-bottom-4 relative w-full flex flex-row gap-2">
                                <Textarea onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                    }
                                }} ref={textAreaRef} style={{ fontSize: sizing.globalFontSize }} disabled={loading} className={`${loading ? '' : ''} p-[15px] px-[20px] h-14 text-base overflow-hidden rounded-xl resize-none text`} placeholder={modeDetails[mode].inputPlaceholder} />
                                <SubmitButton submitting={submitting} />
                            </form>
                        </div>
                        <div className="flex flex-col gap-3 w-5/6 lg:w-4/5">
                            <h1 className=' text-center font-bold'>Examples</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {modeDetails[mode].examples.map((example, index) => {
                                    return (
                                        loading ? <div key={example + index} className="xl:h-16 h-24 w-full bg-gray-200 animate animate-pulse rounded-xl" /> :
                                            <Button key={example + index} onClick={() => {
                                                const textArea = textAreaRef.current;
                                                if (textArea) textArea.value = example;
                                                if (textArea) textArea.focus();
                                            }}
                                                // pings={example.includes("spinal")}
                                                className={`${ruda.className} hover:text-white text-[1.2rem] h-auto text-black w-full px-8 py-4 bg-muted rounded-xl font-bold`}>
                                                {example}
                                            </Button>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                    <section className='flex flex-col items-center w-full px-12' style={{ borderBottom: uiBorder(0.2), paddingTop: spacing.gaps.separateElement, paddingBottom: '20vh', rowGap: spacing.gaps.largest - 10 }}>
                        <div className="w-full max-w-5xl flex flex-col gap-3 items-center">
                            <h1 className='font-bold'>My Brain</h1>
                            <div className="relative w-full flex flex-col gap-4">
                                {
                                    loading ?
                                        <div className='overflow-hidden w-full h-72 rounded-[20px] grid place-items-center bg-gray-100' >
                                            <Loader2 className='animate animate-spin' size={48} color='rgb(229 231 235 / var(--tw-bg-opacity))'></Loader2>
                                        </div> :
                                        <NeuralNetwork style={{ height: '18rem' }} className='w-full' otherPoints={KPs} />
                                }
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Stat key="XP" loading={loading} statTitle="Experience" value={(knowledgePoints ? knowledgePoints.length * experiencePerKnowledgePoint : 0) + ' XP'} />
                                    <Stat key="TotalConcepts" loading={loading} statTitle="Total concept(s) learnt" value={knowledgePoints?.length || 0} />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    )
}

export default Page
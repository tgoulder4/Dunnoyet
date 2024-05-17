'use client'
import React, { useEffect, useState } from 'react'
import { changeColour, colours, responsiveFont, sizing, spacing, uiBorder } from '@/lib/constants'
import { Plus, Send } from 'lucide-react'
import { merriweather, ruda } from '@/app/fonts'
import { Button } from "@/components/ui/button"
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
import { Input } from "@/components/ui/input"
import SwitcherButton from '@/components/UserArea/Home/SwitcherButton'
import { Textarea } from '@/components/ui/textarea'
import NeuralNetwork from '@/components/UserArea/Learn/Lesson/NeuralNetwork'
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
        examples: ["The spinal cavity holds the spinal cord.", "Electrons are negatively charged.", "Gravity makes things fall.", "Plants need sunlight to grow."]
    }, {
        modeTitle: "Free Roam",
        inputPlaceholder: "State something you know",
        modeDescription: "Free Roam: Learn unlimited information around something you know.",
        examples: ["What is the spinal cavity?", "What is the charge of electrons?", "What causes things to fall?", "What do plants need to grow?"]

    }];
    const [mode, setMode] = useState(0);
    return (
        <div className={` flex flex-col`} style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
            <MainAreaNavbar style="normal" show={{ userSide: { newQuestion: false } }} />
            <main className="flex flex-col bg-white h-[100vh]" >
                {/* switcher */}
                <div className="switcher" style={{ paddingTop: spacing.gaps.separateElement, borderBottom: uiBorder(0.2), paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding }}>
                    <div className="transition-all switcherButtons flex flex-row max-w-lg w-full">
                        <SwitcherButton text="New Question" setMode={setMode} mode={mode} />
                        <SwitcherButton text="Free Roam" setMode={setMode} mode={mode} />
                    </div>
                </div>
                <section className='flex flex-col items-center' style={{ borderBottom: uiBorder(0.2), paddingTop: spacing.gaps.largest, paddingBottom: spacing.gaps.largest, paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, rowGap: spacing.gaps.largest - 10 }}>
                    <div className="flex flex-col items-center gap-3 w-full">

                        <h1 className='font-bold'>{modeDetails[mode].modeDescription}</h1>
                        <div className="relative w-full flex flex-row gap-2">
                            <Textarea style={{ fontSize: sizing.globalFontSize }} className='p-[15px] h-14 text-base overflow-hidden rounded-xl resize-none text' placeholder={modeDetails[mode].inputPlaceholder} />
                            <Button className='absolute h-fit bottom-[0.5rem] right-2 p-2 grid place-items-center rounded-xl' style={{ backgroundColor: colours.black }}>
                                <Send size={24} color='white'></Send>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className=' text-center'>Examples</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {modeDetails[mode].examples.map((example, index) => {
                                return (
                                    <Button key={example} className={`${ruda.className} hover:text-white text-base text-black w-full p-8 bg-muted rounded-xl font-bold`}>
                                        {example}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                </section>
                <section className='flex flex-col items-center' style={{ borderBottom: uiBorder(0.2), paddingTop: spacing.gaps.separateElement, paddingBottom: spacing.gaps.largest, paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, rowGap: spacing.gaps.largest - 10 }}>
                    <div className="w-full flex flex-col gap-3 items-center">
                        <h1 className='font-bold'>My Brain</h1>
                        <div className="relative w-full flex flex-row gap-2">
                            <NeuralNetwork className='h-72' knowledgePoints={[]}></NeuralNetwork>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Page
"use client"
import React, { useState } from 'react'
import ChatAreaHeader from '../../../../components/UserArea/Learn/Chat'
import { colours, sizing, spacing } from '@/lib/constants'
import { Plus } from 'lucide-react'
import DisplacingButton from '@/components/ui/displacingButton'
import LessonItem from '../../../../components/UserArea/Learn/LessonItem'
import SummaryItem from '../../../../components/UserArea/Learn/SummaryItem'
import { merriweather } from '@/app/fonts'
import Tip from '../../../../components/UserArea/Learn/Tip'
import Chat from '../../../../components/UserArea/Learn/Chat'
import NewButton from '@/components/ui/NewButton'
import { Metadata } from 'next'
// export const metadata: Metadata = {
//     title: "Dunnoyet - Learn",
// }
const lessonItems = [
    {
        topic: 'Wave-Particle Duality',
        currentInformationIntakeSummary: 'How did the diffraction property of electrons influence the wave-particle duality theory?',
        threadID: 'AEHDB',
    },

    {
        topic: 'Quantum Mechanics',
        currentInformationIntakeSummary: 'What are the fundamental principles of quantum mechanics?',
        threadID: 'ANJ32S',
    },
    {
        topic: 'General Relativity',
        currentInformationIntakeSummary: 'How does general relativity explain the force of gravity?',
        threadID: 'AENJ32',
    },
    {
        topic: 'Artificial Intelligence',
        currentInformationIntakeSummary: 'What are the different types of artificial intelligence?',
        threadID: 'A9GDIJ23',
    },
    {
        topic: 'Machine Learning',
        currentInformationIntakeSummary: 'How does machine learning work?',
        threadID: 'GD92J3',
    },
    {
        topic: 'Blockchain Technology',
        currentInformationIntakeSummary: 'What is blockchain and how does it work?',
        threadID: 'GDIJ32',
    },
]
const summaryItems = [{
    number: 64,
    description: "Lessons Completed"
},
{
    number: 128,
    description: "New Concepts Learned"
}]

function page({ params }: { params: { params: string } }) {
    console.log("params", params);
    const [chatIsOpen, setChatIsOpen] = useState(false);
    return (
        <main className="px-32 flex flex-col" style={{ rowGap: spacing.gaps.separateElement, paddingTop: spacing.gaps.largest, paddingBottom: spacing.gaps.largest, }}>
            <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
                <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: sizing.largestFontSize, fontWeight: 300 }}>Welcome back, Tye!</h1>
                <NewButton buttonVariant='black' actionOrLink={() => setChatIsOpen(true)}><Plus className="h-full" color="white" />
                    Learn something new</NewButton>
            </div>
            <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
                <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: sizing.largerFontSize, fontWeight: 300 }}>Recent Lessons</h1>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: spacing.gaps.groupedElement }}>
                    {
                        lessonItems.map((lessonItem) => {
                            return <LessonItem imageURL="https://cdn.discordapp.com/attachments/917525824956158012/1206262827254546452/image.png?ex=65db5ecd&is=65c8e9cd&hm=0b56bf7134387e07d78439435543eb0c57f5844c665c3d6db46c2bbdf22726e1&" key={lessonItem.threadID} threadID={lessonItem.threadID} topic={lessonItem.topic} currentInformationIntakeSummary={lessonItem.currentInformationIntakeSummary} />
                        })
                    }
                </div>
            </div>
            <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
                <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: sizing.largerFontSize, fontWeight: 300 }}>Summary</h1>
                <div className="flex flex-row flex-wrap" style={{ columnGap: spacing.gaps.separateElement, rowGap: spacing.gaps.separateElement }}>
                    <Tip />
                    {
                        summaryItems.map((summaryItem) => {
                            return <SummaryItem key={summaryItem.description} number={summaryItem.number} desc={summaryItem.description} />
                        })
                    }
                </div>
            </div>
            <Chat setIsOpen={setChatIsOpen} isOpen={chatIsOpen} />
        </main>
    )
}

export default page
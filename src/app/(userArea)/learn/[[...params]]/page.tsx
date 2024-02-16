'use client'
import React, { useContext, useEffect, useState } from 'react'
import { sizing, spacing } from '@/lib/constants'
import { Plus } from 'lucide-react'
import LessonItem from '../../../../components/UserArea/Learn/LessonItem'
import SummaryItem from '../../../../components/UserArea/Learn/SummaryItem'
import { merriweather } from '@/app/fonts'
import Tip from '../../../../components/UserArea/Learn/Tip'
import Chat from '../../../../components/UserArea/Learn/Chat'
import NewButton from '@/components/ui/NewButton'
import { redirect } from 'next/navigation'
import { IDetail, ITip } from '@/lib/validation/enforceTypes'
import { prismaClient } from '@/lib/db/prisma'
import LessonItems from '@/components/UserArea/Learn/LessonItems'
import { getTips } from '@/actions'
import { useSession } from 'next-auth/react'
var equal = require('deep-equal');
// export const metadata: Metadata = {
//     title: "Dunnoyet - Learn",
// }
const prisma = prismaClient;
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
    const {
        id,
        name,
    } = useSession().data?.user!!;

    useEffect(() => {
        async function main() {
            const tips = await getTips();
            console.log("tips: ", tips)
        }
        main()
    }, [])

    return (

        <main className="flex flex-col" style={{ paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, rowGap: spacing.gaps.separateElement, paddingTop: spacing.gaps.largest, paddingBottom: spacing.gaps.largest, }}>
            <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
                <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: sizing.largestFontSize, fontWeight: 300 }}>Welcome back, {name}!</h1>
                <NewButton buttonVariant='black' actionOrLink={() => { setChatIsOpen(true); redirect("/learn/new"); }}><Plus className="h-full" color="white" />
                    Learn something new</NewButton>
            </div>
            <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
                <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: sizing.largerFontSize, fontWeight: 300 }}>Recent Lessons</h1>
                <LessonItems />
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
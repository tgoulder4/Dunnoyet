'use client'
import React, { useContext, useEffect, useState } from 'react'
import { responsiveFont, sizing, spacing } from '@/lib/constants'
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
import { useSession } from 'next-auth/react'
import SummaryItems from '@/components/UserArea/Learn/SummaryItems'
var equal = require('deep-equal');
// export const metadata: Metadata = {
//     title: "Dunnoyet - Learn",
// }
function page({ params }: { params: { params: string } }) {

    console.log("params", params);
    const [chatIsOpen, setChatIsOpen] = useState(false);
    const {
        id,
        name,

    } = useSession().data?.user!!;

    return (

        <main className="flex flex-col" style={{ paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, rowGap: spacing.gaps.separateElement, paddingTop: spacing.gaps.largest, paddingBottom: spacing.gaps.largest, }}>
            <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
                <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largestFontSize), fontWeight: 300 }}>Welcome back, {name}!</h1>
                <NewButton buttonVariant='black' actionOrLink='/learn/new'><Plus className="h-full" color="white" />
                    Learn something new</NewButton>
            </div>
            <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
                <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largerFontSize), fontWeight: 300 }}>Recent Lessons</h1>
                <LessonItems />
            </div>
            <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
                <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largerFontSize), fontWeight: 300 }}>Summary</h1>
                <div className="flex flex-row flex-wrap" style={{ columnGap: spacing.gaps.separateElement, rowGap: spacing.gaps.separateElement }}>
                    <Tip />
                    <SummaryItems />
                </div>
            </div>
            <Chat setIsOpen={setChatIsOpen} isOpen={chatIsOpen} />
        </main>
    )
}

export default page
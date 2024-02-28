'use client'
import React, { use, useContext, useEffect, useState } from 'react'
import { changeColour, colours, responsiveFont, sizing, spacing } from '@/lib/constants'
import { Plus } from 'lucide-react'
import LessonItem from '../../../components/UserArea/Learn/LessonItem'
import SummaryItem from '../../../components/UserArea/Learn/SummaryItem'
import { merriweather, ruda } from '@/app/fonts'
import Tip from '../../../components/UserArea/Learn/Tip'
import NewButton from '@/components/ui/NewButton'
import { redirect } from 'next/navigation'
import { IDetail, ITip } from '@/lib/validation/enforceTypes'
import { prismaClient } from '@/lib/db/prisma'
import LessonItems from '@/components/UserArea/Learn/LessonItems'
import { useSession } from 'next-auth/react'
import SummaryItems from '@/components/UserArea/Learn/SummaryItems'
import ChatWithEli from '../../../components/UserArea/Learn/ChatWithEli'
import { getLessons } from '@/actions'
import { ILesson } from '@/lib/validation/enforceTypes'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
var equal = require('deep-equal');
// export const metadata: Metadata = {
//     title: "Dunnoyet - Learn",
// }
function page({ params }: { params: { params: string } }) {

    console.log("params", params);
    const [chatIsOpen, setChatIsOpen] = useState(false);
    const [tutorialMode, setTutorialMode] = useState(false);
    const [lessonItems, setLessonItems] = useState(null as ILesson[] | null);
    // const {
    //     id,
    //     name,
    // } = useSession().data?.user!!;
    const { id, name } = { id: "65dbe7799c9c2a30ecbe6193", name: "" }
    if (!id) throw new Error("No user ID found")
    useEffect(() => {
        if (!name) {
            setTutorialMode(true);
        }
        async function main() {
            console.log("LessonItems calling getLessons with userID: ", id!!)
            const items = await getLessons(id!!);
            setLessonItems(items);
        }
        main()
    }, [])
    return (
        <div className={` flex flex-col`} style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
            <MainAreaNavbar style="normal" />
            <main className="flex flex-col" style={{ paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, rowGap: spacing.gaps.separateElement, paddingTop: spacing.gaps.largest, paddingBottom: spacing.gaps.largest, }}>
                <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
                    <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largestFontSize), fontWeight: 300 }}>{name ? "Welcome back, " + name : "Hi there!"}</h1>
                    <div className='relative w-fit'><NewButton pings={tutorialMode} buttonVariant='black' actionOrLink={tutorialMode ? () => { setTutorialMode(false); setChatIsOpen(true) } : '/learn/new'}><Plus className="h-full" color="white" />
                        Learn something new</NewButton>
                        {tutorialMode &&
                            <div className='transition-opacity z-10 absolute left-[322px] top-[-100%] w-max right-0' >
                                <div style={{ rowGap: 14, backgroundColor: changeColour(colours.blue).darken(8).toString() }} className="relative flex flex-col rounded-[10px] p-[28px] ">
                                    <div className="absolute top-1/5 left-[-45px] z-[9]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="71" height="80" viewBox="0 0 71 80" fill="none">
                                            <path d="M62.8013 1.33013C66.1346 -0.594373 70.3013 1.81125 70.3013 5.66025L70.3013 74.9423C70.3013 78.7913 66.1346 81.1969 62.8013 79.2724L2.80127 44.6314C-0.532061 42.7069 -0.532064 37.8956 2.80127 35.9711L62.8013 1.33013Z" fill={changeColour(colours.blue).darken(8).toString()} />
                                        </svg>
                                    </div>
                                    <h2 className='font-black'>Welcome, learner!</h2>
                                    <h2>Ready to begin your learning journey?</h2>
                                </div>
                            </div>}
                    </div>
                </div>
                <div aria-disabled={tutorialMode} className="flex flex-col" style={{ opacity: tutorialMode ? 0.3 : 1, rowGap: spacing.gaps.groupedElement }}>
                    <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largerFontSize), fontWeight: 300 }}>Recent Lessons</h1>
                    <LessonItems lessons={lessonItems} tutorialMode={tutorialMode} />
                </div>
                <div aria-disabled={tutorialMode} className="flex flex-col" style={{ opacity: tutorialMode ? 0.3 : 1, rowGap: spacing.gaps.groupedElement }}>
                    <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largerFontSize), fontWeight: 300 }}>Summary</h1>
                    <div className="flex flex-row flex-wrap" style={{ columnGap: spacing.gaps.separateElement, rowGap: spacing.gaps.separateElement }}>
                        <Tip />
                        <SummaryItems />
                    </div>
                </div>
                <ChatWithEli lessons={lessonItems} lessonID={"Tutorial"} setIsOpen={setChatIsOpen} isOpen={chatIsOpen} />
            </main>
        </div>
    )
}

export default page
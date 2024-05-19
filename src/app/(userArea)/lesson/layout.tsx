'use client'
import { merriweather, ruda } from '@/app/fonts'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
import Brainmap from '@/components/UserArea/Learn/Lesson/BrainMap/Brainmap'
import LearningPathItem from '@/components/UserArea/Learn/Lesson/LearningPathItem'
import LessonSection from '@/components/UserArea/Learn/Lesson/LessonSection'
import LessonSkeleton from '@/components/UserArea/Learn/Lesson/LessonSkeleton'
import { colours, sizing, spacing, uiBorder } from '@/lib/constants'
import React from 'react'
function LessonLayout({
    params, children
}: {
    params: any, children: React.ReactNode
}) {
    //i want to receieve multiple updates from the db. when lesson is made, load skeleton ui. when rest payload is received, load the actual ui
    // promise .all for all the data needed for the lesson ui to load. once done setLoading false
    return (
        <div className={` flex flex-col h-[100vh]`} style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
            <MainAreaNavbar style='normal' show={{ userSide: { newQuestion: false }, leftSide: { lessonTimer: false } }} />
            {/* the only children would be in the center grid cell */}
            <LessonSkeleton params={params} payload={{ stage: "loading", lastSaved: new Date }}>{children}</LessonSkeleton>
        </div>
    )
}

export default LessonLayout
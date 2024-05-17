'use client'
import { merriweather, ruda } from '@/app/fonts'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
import LessonSection from '@/components/UserArea/Learn/Lesson/LessonSection'
import { colours, sizing, uiBorder } from '@/lib/constants'
import React from 'react'
function LessonLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className={` flex flex-col h-[100vh]`} style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
            <MainAreaNavbar style='normal' show={{ userSide: { newQuestion: false }, leftSide: { lessonTimer: false } }} />
            {/* the only children would be in the center grid cell */}
            <div className="grid grid-cols-3 h-full">
                <div className="flex flex-col" style={{ borderRight: uiBorder(0.1) }}>
                    <LessonSection style={{ borderBottom: uiBorder(0.1) }} className='learningPath'></LessonSection>
                    <LessonSection className='brainMap'></LessonSection>
                </div>
                <LessonSection style={{ borderRight: uiBorder(0.1) }} className='lessonChat'>{children}</LessonSection>
                <LessonSection className='notesArea'></LessonSection>
            </div>
        </div>
    )
}

export default LessonLayout
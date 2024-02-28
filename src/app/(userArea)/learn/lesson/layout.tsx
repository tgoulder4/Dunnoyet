'use client'
import { merriweather, ruda } from '@/app/fonts'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
import { colours, sizing } from '@/lib/constants'
import React from 'react'
function LessonLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className={` flex flex-col`} style={{ backgroundColor: colours.background, fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
            <MainAreaNavbar style="lesson" />
            {children}
        </div>
    )
}

export default LessonLayout
'use client'
import { ILesson } from '@/lib/validation/enforceTypes'
import React from 'react'
import { merriweather } from '@/app/fonts'
import ChatWithEli from '@/components/UserArea/Learn/ChatWithEli'
import { responsiveFont, sizing, spacing } from '@/lib/constants'
import { colours, changeColour } from '@/lib/constants'

export default function LessonPage({ lesson }: { lesson: ILesson }) {
    return (<>
        <div className='h-full flex flex-col' style={{ rowGap: spacing.gaps.groupedElement, paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, paddingTop: spacing.padding.largest }}>
            <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largerFontSize) }}>Vectors: Arrow Representation</h1>
            <div className='w-full h-full rounded-[20px] border-2' style={{ borderColor: colours.complementary_lighter, backgroundColor: changeColour(colours.complementary_lightest).lighten(5).toString() }}>
                <canvas></canvas>
            </div>
        </div>
        <ChatWithEli isOpen={true} lesson={lesson} />
    </>
    )
}
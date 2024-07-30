import { changeColour, colours } from '@/lib/constants'
import React from 'react'

function LearningPathItemTitle({ confidence, text }: { confidence: number, text: string }) {
    let mainColour = colours.primary
    let textColour = '#000'
    const placeholderMode = text == 'Placeholder';
    if (placeholderMode) {
        mainColour = colours.border
    }
    else {
        switch (confidence) {
            case 0:
                mainColour = changeColour(colours.lessonNodes.confidence1).setAlpha(0.3).toString()
                textColour = changeColour(colours.lessonNodes.confidence1).setAlpha(0.5).toString()
                break
            case 1:
                mainColour = colours.lessonNodes.confidence1
                textColour = colours.complementary
                break
            case 2:
                mainColour = colours.lessonNodes.confidence2
                textColour = colours.black
                break
        }
    }
    return (
        <div className='flex flex-row gap-3 items-center'>
            <div style={{ backgroundColor: mainColour }} className={`${placeholderMode ? 'animate animate-pulse' : ''} w-5 h-5 shrink-0 rounded-full`} />
            {placeholderMode ? <div style={{ backgroundColor: mainColour }} className='w-full h-8 animate animate-pulse rounded-lg' /> : <h2 style={{ color: textColour }}>{text}</h2>}
        </div>
    )
}

export default LearningPathItemTitle
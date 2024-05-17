import React from 'react'
import LearningPathItemTitle from './LearningPathItemTitle'

function LearningPathItem({ confidence, text }: { confidence: number, text: string }) {
    return (<>
        <div className='flex flex-col gap-3 h-full'>
            <LearningPathItemTitle confidence={confidence} text={text} />
            <div className="h-full ml-[0.83rem] w-[1px] border-dashed border-spacing-10 border-2 border-gray-300 animate animate-pulse"></div>
        </div>
    </>
    )
}

export default LearningPathItem
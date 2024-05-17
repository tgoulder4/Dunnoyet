import React from 'react'
import LearningPathItemTitle from './LearningPathItemTitle'

function LearningPathItem({ confidence, text }: { confidence: number, text: string }) {
    return (<>
        <div className='flex-1 flex flex-col gap-3 h-full'>
            <LearningPathItemTitle confidence={confidence} text={text} />
            <div className="h-full ml-[0.83rem] w-[1px] border-dashed border-spacing-2 border-separate border-2 border-gray-200 animate animate-pulse"></div>
        </div>
    </>
    )
}

export default LearningPathItem
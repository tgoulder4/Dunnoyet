import React from 'react'
import LearningPathItemTitle from './LearningPathItemTitle'

function LearningPathItem({ confidence, text, lastItem }: { confidence: number, text: string, lastItem?: boolean }) {
    return (<>
        <div className={`${lastItem ? "flex-0" : "flex-1"} flex flex-col gap-3 h-auto`}>
            <LearningPathItemTitle confidence={confidence} text={text} />
            {!lastItem && <div className="h-full ml-[0.57rem] w-[1px] border-dashed border-spacing-2 border-separate border-2 border-gray-200 animate animate-pulse"></div>}
        </div>
    </>
    )
}

export default LearningPathItem
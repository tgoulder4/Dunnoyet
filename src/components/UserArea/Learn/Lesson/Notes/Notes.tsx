import { colours, spacing } from '@/lib/constants'
import React from 'react'

function Notes({ placeholderMode }: { placeholderMode?: boolean }) {
    return (
        <div style={{ paddingBottom: 2 * spacing.gaps.largest }}>
            {placeholderMode ?
                <div className='flex flex-col gap-3 h-full'>
                    <div style={{ backgroundColor: colours.border }} className='w-1/3 h-8 animate animate-pulse rounded-lg' />
                    <div style={{ backgroundColor: colours.border }} className="w-full h-full animate animate-pulse rounded-lg"></div>
                </div> : <></>
            }
        </div>
    )
}

export default Notes
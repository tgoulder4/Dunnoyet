import { colours } from '@/lib/constants'
import React from 'react'

function Brainmap({ placeholderMode }: { placeholderMode: boolean }) {
    return (
        <div className='bmarea'>
            {
                placeholderMode ?
                    <div className='flex flex-col gap-3'>
                        <div style={{ backgroundColor: colours.border }} className='w-1/3 h-8 animate animate-pulse rounded-full' />
                        <div className="w-full h-full animate animate-pulse rounded-full"></div>
                    </div> : <></>
            }
            <h2></h2>
        </div>
    )
}

export default Brainmap
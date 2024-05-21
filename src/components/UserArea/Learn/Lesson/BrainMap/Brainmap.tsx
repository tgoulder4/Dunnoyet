import { colours } from '@/lib/constants'
import React from 'react'
import NeuralNetwork from '../Network/NeuralNetwork'
import { z } from 'zod'
import { KPSchema } from '@/lib/validation/primitives'
function Brainmap({ KPsToFocus, OtherKPs, placeholderMode }: { KPsToFocus?: z.infer<typeof KPSchema>[], OtherKPs?: z.infer<typeof KPSchema>[], placeholderMode?: boolean }) {
    if (!KPsToFocus && !OtherKPs && !placeholderMode) return <h1>Brainmap initialised incorrectly</h1>
    return (
        <div className='bmarea h-full'>
            {
                placeholderMode ?
                    <div className='flex flex-col gap-3 h-full'>
                        <div style={{ backgroundColor: colours.border }} className='w-1/3 h-8 animate animate-pulse rounded-lg' />
                        <div style={{ backgroundColor: colours.border }} className="w-full h-full animate animate-pulse rounded-lg"></div>
                    </div> : <div className='flex flex-col gap-3 h-full'>
                        <h2 className='font-bold'>Brain map</h2>
                        <NeuralNetwork knowledgePointsToFocus={KPsToFocus!} otherPoints={OtherKPs!} />
                    </div>
            }
        </div>
    )
}

export default Brainmap
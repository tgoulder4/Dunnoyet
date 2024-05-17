import { colours } from '@/lib/constants'
import React from 'react'
import NeuralNetwork from '../Network/NeuralNetwork'

function Brainmap({ placeholderMode }: { placeholderMode: boolean }) {
    return (
        <div className='bmarea h-full'>
            {
                placeholderMode ?
                    <div className='flex flex-col gap-3 h-full'>
                        <div style={{ backgroundColor: colours.border }} className='w-1/3 h-8 animate animate-pulse rounded-lg' />
                        <div style={{ backgroundColor: colours.border }} className="w-full h-full animate animate-pulse rounded-lg"></div>
                    </div> : <div className='flex flex-col gap-3 h-full'>
                        <h2>Brain map</h2>
                        <NeuralNetwork knowledgePointsToFocus={[
                            {
                                TwoDvK: [0, 0],
                                confidence: 1,
                                pointInSolitude: 'Electrons are negatively charged.',
                                source: 'reinforced'
                            },
                            {
                                TwoDvK: [10, 8],
                                confidence: 1,
                                pointInSolitude: 'Protons are positively charged.',
                                source: 'reinforced'
                            },
                            {
                                TwoDvK: [5, 5],
                                confidence: 2,
                                pointInSolitude: 'Neutrons have no charge.',
                                source: 'reinforced'
                            },
                        ]} />
                    </div>
            }
            <h2></h2>
        </div>
    )
}

export default Brainmap
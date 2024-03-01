import React from 'react'
import { colours, changeColour } from '@/lib/constants'
import { sizing } from '@/lib/constants'
import { IKnowledge } from '@/lib/validation/enforceTypes'

function NeuralNetwork({ knowledgePoints }: { knowledgePoints: IKnowledge[] }) {
    return (
        <div className="" style={{ paddingRight: sizing.variableWholePagePadding }}>
            <div className='w-full h-full rounded-[20px] border-2' style={{ borderColor: colours.complementary_lighter, backgroundColor: changeColour(colours.complementary_lightest).lighten(5).toString() }}>
                <canvas id="canvas">
                    {
                        knowledgePoints.map((point, index) => {
                            return (
                                <div key={index} style={{ position: 'absolute', top: point.TwoDCoOrdinates[0], left: point.TwoDCoOrdinates[1] }}>
                                    <div style={{ backgroundColor: colours.accent, borderRadius: '50%', width: '10px', height: '10px' }}></div>
                                </div>
                            )
                        })
                    }
                </canvas>
            </div>
        </div>
    )
}

export default NeuralNetwork
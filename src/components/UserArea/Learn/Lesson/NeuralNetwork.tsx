'use client'
import { changeColour, colours, sizing } from '@/lib/constants'
import React from 'react'

function NeuralNetwork() {
    return (
        <div className='w-full h-full rounded-[20px] border-2' style={{ borderColor: colours.complementary_lighter, paddingRight: sizing.variableWholePagePadding, backgroundColor: changeColour(colours.complementary_lightest).lighten(5).toString() }}>
            <canvas></canvas>
        </div>
    )
}

export default NeuralNetwork
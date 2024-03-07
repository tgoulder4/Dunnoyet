import { INode } from '@/lib/validation/enforceTypes'
import React from 'react'

function Line({ startPosition, endNode, pulsating }: { startPosition: { x: number, y: number }, endNode: INode, pulsating: boolean }) {
    return (<></>
        // <line x1={startPosition.x} y1={startPosition.y} x2={endNode.TwoDCoOrdinates[0]} y2={endNode.TwoDCoOrdinates[1]} className={`${pulsating ? 'animate-pulse' : ''} w-1`} />
    )
}

export default Line
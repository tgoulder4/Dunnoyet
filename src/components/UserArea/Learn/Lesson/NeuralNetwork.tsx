import React, { useEffect, useRef, useState } from 'react'
import { colours, changeColour } from '@/lib/constants'
import { sizing } from '@/lib/constants'
import { IKnowledge } from '@/lib/validation/enforceTypes'
import { getEmbedding } from '@/lib/chat/openai'
import { getTwoDCoOrdinatesOfEmbeddings } from './network'

function NeuralNetwork({ knowledgePoints }: { knowledgePoints: IKnowledge[] }) {
    //for each kp to above fn

    console.log("[neuralNetwork] knowledgePoints: ", knowledgePoints)
    console.log("rendering NeuralNetwork with knowledgePoints: ", knowledgePoints)
    const canvasRef = useRef(null);
    const drag = useRef({ isDragging: false, startX: 0, startY: 0 });
    const offset = useRef({ x: 0, y: 0 });
    const draw = (ctx: CanvasRenderingContext2D, offsetX = 0, offsetY = 0) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        knowledgePoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.TwoDCoOrdinates[0] + offsetX, point.TwoDCoOrdinates[1] + offsetY, 10, 0, 2 * Math.PI);
            ctx.fillStyle = point.confidence == 5 ? colours.primary : point.confidence == 4 ? colours.complementary : colours.complementary;
            ctx.fill();

            //on hover, show the point's info
            ctx.font = "20px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(point.pointInSolitude, point.TwoDCoOrdinates[0] + offsetX, point.TwoDCoOrdinates[1] + offsetY);
            ctx.closePath();

        });
    };
    useEffect(() => {
        console.log("useEffect called")
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not found');
        // Adjust for device pixel ratio to fix blurriness
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // offset values to move the canvas around
        let offsetX = offset.current.x;
        let offsetY = offset.current.y;

        const onMouseDown = (e: MouseEvent) => {
            drag.current.isDragging = true;
            drag.current.startX = e.clientX - offsetX;
            drag.current.startY = e.clientY - offsetY;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!drag.current.isDragging) return;
            offsetX = e.clientX - drag.current.startX;
            offsetY = e.clientY - drag.current.startY;
            draw(ctx, offsetX, offsetY);
        };

        const onMouseUp = () => {
            drag.current.isDragging = false;
            offset.current.x = offsetX;
            offset.current.y = offsetY;
        };

        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        draw(ctx); // Initial draw

        // Clean up to prevent memory leaks
        return () => {
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [knowledgePoints]);
    return (
        <div className="" style={{ paddingRight: sizing.variableWholePagePadding }}>
            <div className='w-full h-full rounded-[20px] border-2' style={{ borderColor: colours.complementary_lighter, backgroundColor: changeColour(colours.complementary_lightest).lighten(5).toString() }}>
                <canvas className='w-full h-full' id="canvas" ref={canvasRef}>
                </canvas>
            </div>
        </div>
    )
}

export default NeuralNetwork
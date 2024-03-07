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
    const [scale, setScale] = useState(1); // Initial zoom scale
    const drawBackground = (ctx: CanvasRenderingContext2D, offsetX = 0, offsetY = 0) => {
        //draw loads of small dots of colour complementary
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const dotSize = 4;
        const step = 30;
        for (let x = 0; x < width; x += dotSize + step) {
            for (let y = 0; y < height; y += dotSize + step) {
                ctx.beginPath();
                ctx.arc(x + offsetX, y + offsetY, dotSize, 0, 2 * Math.PI);
                ctx.fillStyle = colours.complementary_lightest;
                ctx.fill();
            }
        }
    }
    const draw = (ctx: CanvasRenderingContext2D, offsetX = 0, offsetY = 0) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawBackground(ctx, offsetX, offsetY);
        knowledgePoints.forEach((point, i) => {
            ctx.beginPath();
            ctx.arc(knowledgePoints[i].TwoDCoOrdinates[0] + offsetX, knowledgePoints[i].TwoDCoOrdinates[1] + offsetY, 5, 0, 2 * Math.PI);
            ctx.fillStyle = point.confidence == 5 ? colours.primary : point.confidence == 4 ? colours.complementary : colours.complementary;
            let pointBackgroundColour = "";
            switch (point.confidence) {
                //5=wellKnown, 4=currentlyTeaching, 3=failedTest,2=target,1=makeNewKnowledgeAnchorPoint 
                case 5:
                    pointBackgroundColour = colours.lessonNodes.confidence5
                    break;
                case 4:
                    pointBackgroundColour = colours.lessonNodes.confidence4;
                    break;
                case 3:
                    pointBackgroundColour = colours.lessonNodes.confidence3;
                    break;
                case 2:
                    pointBackgroundColour = colours.lessonNodes.confidence2;
                    break;
                case 1:
                    pointBackgroundColour = colours.lessonNodes.confidence1;
                    break;
                default:
                    pointBackgroundColour = colours.complementary;
                    break;
            }
            ctx.fillStyle = pointBackgroundColour; // Apply the color here
            ctx.fill();

            //on hover, show the point's info
            // ctx.font = "20px Arial";
            // ctx.fillText(point.pointInSolitude, point.TwoDCoOrdinates[0] + offsetX, point.TwoDCoOrdinates[1] + offsetY);
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
        const onWheel = (e: WheelEvent) => {
            e.preventDefault(); // Prevent the page from scrolling
            const zoomFactor = 0.1;
            const newScale = e.deltaY < 0 ? scale * (1 + zoomFactor) : scale * (1 - zoomFactor);
            setScale(newScale);
        };
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('wheel', onWheel);

        draw(ctx); // Initial draw

        // Clean up to prevent memory leaks
        return () => {
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            canvas.removeEventListener('wheel', onWheel);
        };
    }, [knowledgePoints, scale]);
    return (
        <div className="" style={{ paddingRight: sizing.variableWholePagePadding }}>
            <div className='overflow-hidden w-full h-full rounded-[20px] border-2' style={{ borderColor: '#E8E8E8', backgroundColor: colours.lessonNodes.background }}>
                {/* dynamic tailwind classes don't render unless we explicitly define them: */}
                <div className="hidden animate-pulse"></div>
                <canvas className='w-full h-full overflow-hidden' id="canvas" ref={canvasRef}>
                    {/* <line x1="0" y1="0" x2="200" y2="100" className="w-1 bg-red-500" /> */}
                </canvas>
            </div>
        </div>
    )
}

export default NeuralNetwork
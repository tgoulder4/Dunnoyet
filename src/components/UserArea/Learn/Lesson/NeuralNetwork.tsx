import React, { useEffect, useMemo, useRef, useState } from 'react'
import { colours, changeColour } from '@/lib/constants'
import { sizing } from '@/lib/constants'
import { IKnowledge } from '@/lib/validation/enforceTypes'
import { getEmbedding } from '@/lib/chat/openai'
import { getTwoDCoOrdinatesOfEmbeddings } from './network'
import { getAllReinforcedKnowledgePoints, getRelatedKnowledgePoints } from '@/lib/chat/Eli/eli'
import { useSession } from 'next-auth/react'

function NeuralNetwork({ knowledgePoints }: { knowledgePoints: IKnowledge[] }) {
    //for each kp to above fn
    const sess = useSession().data!.user!;
    const {
        id: userId,
    } = sess;
    console.log("[neuralNetwork] knowledgePoints: ", knowledgePoints)
    console.log("rendering NeuralNetwork with knowledgePoints: ", knowledgePoints)
    const canvasRef = useRef(null);
    const drag = useRef({ isDragging: false, startX: 0, startY: 0 });
    const offset = useRef({ x: 0, y: 0 });
    console.log("INITIAL DEFINITION Offset: ", offset.current.x, offset.current.y)
    const scale = useRef(1);
    const [allKnowledgePoints, setAllKnowledgePoints] = useState<null | IKnowledge[]>(null);
    // Function to calculate boundaries
    const calculateBoundaries = (points: IKnowledge[]) => {
        const xValues = points.map(point => point.TwoDCoOrdinates[0]);
        const yValues = points.map(point => point.TwoDCoOrdinates[1]);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        return { minX, maxX, minY, maxY };
    };
    const adjustView = (ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) => {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const { minX, maxX, minY, maxY } = calculateBoundaries(knowledgePoints);
        const adjustedScale = Math.min(width / (maxX - minX), height / (maxY - minY));
        const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
        return { adjustedScale, center };
    }
    const draw = (ctx: CanvasRenderingContext2D, offsetX = 0, offsetY = 0, scale = 1) => {

        // Store the current transformation matrix
        ctx.save();


        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Restore the transform
        ctx.restore();

        // Reapply the transformations needed for your drawing
        // ctx.translate(offset.current.x, offset.current.y);

        //DRAW THE BACKGROUND: draw loads of small dots of colour complementary
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
        //DRAW PAST KNOWLEDGE POINTS
        if (allKnowledgePoints) {
            allKnowledgePoints.forEach((point, i) => {
                ctx.beginPath();
                ctx.arc(allKnowledgePoints[i].TwoDCoOrdinates[0] + offsetX, allKnowledgePoints[i].TwoDCoOrdinates[1] + offsetY, 5, 0, 2 * Math.PI);
                ctx.fillStyle = changeColour(colours.complementary).lighten(4).toString();
                ctx.fill();
                ctx.closePath();
            });
        }

        //DRAW THE KNOWLDGE POINTS FROM CHAIN
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
    };    // Effect hook to adjust initial zoom and position based on knowledgePoints length
    useEffect(() => {
        async function main() {
            const allKp = await getAllReinforcedKnowledgePoints(userId!);
            console.log("Setting allKnowledgePoints to: ", allKp)
            setAllKnowledgePoints(allKp);
        }
        main()
    }, [])
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
            console.log("Offset: ", offset.current.x, offset.current.y)
            drag.current.isDragging = true;
            // Store the initial click position relative to the viewport
            drag.current.startX = e.clientX;
            drag.current.startY = e.clientY;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!drag.current.isDragging) return;

            // Calculate the delta between the current mouse position and the initial click position
            const dx = e.clientX - drag.current.startX;
            const dy = e.clientY - drag.current.startY;

            // Update the drag start position to the current position
            drag.current.startX = e.clientX;
            drag.current.startY = e.clientY;

            // Calculate potential new offsets by adding deltas
            const potentialOffsetX = offset.current.x + dx;
            const potentialOffsetY = offset.current.y + dy;

            // Define maximum and minimum offsets
            const maxOffset = 50;
            const minOffset = -50; // Assuming you also want to limit dragging in the opposite direction

            // Apply limits to the new offsets
            offset.current.x = Math.min(Math.max(potentialOffsetX, minOffset), maxOffset);
            offset.current.y = Math.min(Math.max(potentialOffsetY, minOffset), maxOffset);

            draw(ctx, offset.current.x, offset.current.y, scale.current);
        };

        const onMouseUp = () => {
            drag.current.isDragging = false;
            console.log("Offset: ", offset.current.x, offset.current.y)
            // setOffset({ x: offsetX, y: offsetY });
        };
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const zoomFactor = 0.1;
            const direction = e.deltaY < 0 ? 1 : -1;
            scale.current = (1 + zoomFactor * direction);
            console.log("Scale: ", scale.current)
            ctx.scale(scale.current, scale.current);
            draw(ctx, offset.current.x, offset.current.y, scale.current);
            // setScale(newScale);
        };
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('wheel', onWheel);

        draw(ctx, offset.current.x, offset.current.y, scale.current); // Initial draw


        // Clean up to prevent memory leaks
        return () => {
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            canvas.removeEventListener('wheel', onWheel);
        };
    }, [offset.current, scale.current, knowledgePoints]); // Dependency on offset, scale, and knowledgePoints so that 

    return (
        <div className="" style={{ paddingRight: sizing.variableWholePagePadding }}>
            <div className='overflow-hidden w-full h-full rounded-[20px] border-2' style={{ borderColor: '#E8E8E8', backgroundColor: colours.lessonNodes.background }}>
                {/* dynamic tailwind classes don't render unless we explicitly define them: */}
                <div className="hidden bg-opacity-50 animate-pulse"></div>
                <canvas className='w-full h-full overflow-hidden' id="canvas" ref={canvasRef}>
                    {/* <line x1="0" y1="0" x2="200" y2="100" className="w-1 bg-red-500" /> */}
                </canvas>
            </div>
        </div>
    )
}

export default NeuralNetwork
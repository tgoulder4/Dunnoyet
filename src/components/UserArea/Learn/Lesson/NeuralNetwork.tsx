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
    const draw = (ctx: CanvasRenderingContext2D, offsetX = 0, offsetY = 0, scale = 1) => {
        // Reset the transformation matrix to default before clearing
        // ctx.setTransform(1, 0, 0, 1, 0, 0); // Resets to the default state
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears everything

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
            drag.current.isDragging = true;
            drag.current.startX = e.clientX - offsetX;
            drag.current.startY = e.clientY - offsetY;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!drag.current.isDragging) return;

            const newOffsetX = e.clientX - drag.current.startX;
            const newOffsetY = e.clientY - drag.current.startY;

            // Here, you can adjust the limits based on your requirements.
            // For example, to prevent dragging the canvas too far from its original position:
            const maxOffset = 50;
            const minOffset = -50; // Assuming you also want to limit dragging in the opposite direction

            // Applying limits
            const limitedOffsetX = Math.min(Math.max(newOffsetX, minOffset), maxOffset);
            const limitedOffsetY = Math.min(Math.max(newOffsetY, minOffset), maxOffset);

            // Update offsets within the allowed range
            offset.current.x = limitedOffsetX;
            offset.current.y = limitedOffsetY;

            draw(ctx, offset.current.x, offset.current.y, scale.current);
        };

        const onMouseUp = () => {
            drag.current.isDragging = false;

            // setOffset({ x: offsetX, y: offsetY });
        };
        const onWheel = (e: WheelEvent) => {
            e.preventDefault(); // Prevent the page from scrolling
            const zoomFactor = 0.1;
            scale.current = e.deltaY < 0 ? scale.current * (1 + zoomFactor) : scale.current * (1 - zoomFactor);
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
    }, [offset, scale.current, knowledgePoints]); // Dependency on offset, scale, and knowledgePoints so that 
    const adjustView = (ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) => {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const { minX, maxX, minY, maxY } = calculateBoundaries(knowledgePoints);
        const adjustedScale = Math.min(width / (maxX - minX), height / (maxY - minY));
        const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
        return { adjustedScale, center };
    }

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
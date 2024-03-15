import React, { useEffect, useMemo, useRef, useState } from 'react'
import { colours, changeColour } from '@/lib/constants'
import { sizing } from '@/lib/constants'
import { IKnowledge } from '@/lib/validation/enforceTypes'
import { getEmbedding } from '@/lib/chat/openai'
import { getTwoDCoOrdinatesOfEmbeddings } from './network'
import { getAllReinforcedKnowledgePoints, getRelatedKnowledgePoints } from '@/lib/chat/Eli/eli'
import { useSession } from 'next-auth/react'
// Helper function to get color based on confidence, reused from previous message
function getColourFromConfidence(confidence: number) {
    switch (confidence) {
        case 5:
            return colours.lessonNodes.confidence5;
        case 4:
            return colours.lessonNodes.confidence4;
        case 3:
            return colours.lessonNodes.confidence3;
        case 2:
            return colours.lessonNodes.confidence2;
        case 1:
            return colours.lessonNodes.confidence1;
        default:
            return colours.complementary;
    }
}
// Function to calculate the opacity for pulsating effect
let pulsateOpacity = 1;
let pulsateDirection = true; // true for increasing, false for decreasing
const updatePulsateOpacity = (frameRate: number) => {
    const speed = 1 / frameRate; // Speed of pulsating effect
    if (pulsateDirection) {
        pulsateOpacity += speed;
        if (pulsateOpacity >= 1) {
            pulsateOpacity = 1;
            pulsateDirection = false;
        }
    } else {
        pulsateOpacity -= speed;
        if (pulsateOpacity <= 0.1) {
            pulsateOpacity = 0.1;
            pulsateDirection = true;
        }
    }
};
function NeuralNetwork({ knowledgePoints }: { knowledgePoints: IKnowledge[] }) {
    //for each kp to above fn
    const sess = useSession().data!.user!;
    const {
        id: userId,
    } = sess;
    // console.log("[neuralNetwork] knowledgePoints: ", knowledgePoints)
    // console.log("rendering NeuralNetwork with knowledgePoints: ", knowledgePoints)
    const canvasRef = useRef(null);
    const drag = useRef({ isDragging: false, startX: 0, startY: 0 });
    const offset = useRef({ x: 0, y: 0 });
    // console.log("INITIAL DEFINITION Offset: ", offset.current.x, offset.current.y)
    const scaleMultiplier = useRef(0.7)
    const [allKnowledgePoints, setAllKnowledgePoints] = useState<null | IKnowledge[]>(null);
    const prevKNowledgePoints = useRef(knowledgePoints);
    const requestAnimationRef = useRef<any>(null);
    if (prevKNowledgePoints.current == knowledgePoints) {
        (() => cancelAnimationFrame(requestAnimationRef.current))();
    } else {
        prevKNowledgePoints.current = knowledgePoints;
    }
    var t: Array<number> = [];
    //being more resource friendly by only calculating the required frame rate. Draw updates ALOT and for some requestAnimationFrame affects the whole page's frame rate.
    //this is responsible for laggy scrollbar. scrollbar click events are disabled as a result
    const getRequiredFrameRate = () => new Promise<number>((resolve, reject) => {
        if (frameRate !== 60) resolve(Math.min(frameRate, 240));
        const getNext = () => {
            const now = performance.now();
            t.unshift(now);
            if (t.length > 5) {
                var t0 = t.pop();
                var fps = Math.floor(1000 * 5 / (now - (t0 || 0)));
                console.log("Resolving fps: ", fps)
                resolve(fps);
                return () => cancelAnimationFrame(requestAnimationRef.current);
            } else {

                requestAnimationRef.current = requestAnimationFrame(getNext);
            }

        };
        getNext();
    });

    let frameRate: number = 60;
    // Function to calculate boundaries
    const calculateOffsetAndScaleToFocusCurrentChain = (ctx: CanvasRenderingContext2D, points: IKnowledge[]) => {
        const xValues = points.map(point => point.TwoDCoOrdinates[0]);
        // console.log("xValues: ", xValues)
        const yValues = points.map(point => point.TwoDCoOrdinates[1]);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        const xRange = maxX - minX;
        const yRange = maxY - minY;
        // console.log("minX: ", minX, " maxX: ", maxX, " minY: ", minY, " maxY: ", maxY, " xRange: ", xRange, " yRange: ", yRange)
        const overallScale = Math.min(ctx.canvas.width / xRange, ctx.canvas.height / yRange) * 0.15;
        const centerOffsetX = minX + (xRange / 2);
        const centerOffsetY = minY + (yRange / 2);
        // console.log("centerOffsetX: ", centerOffsetX, " centerOffsetY: ", centerOffsetY)
        return { centerOffsetX, centerOffsetY, overallScale };
    };

    // Function to adjust view
    const draw = (ctx: CanvasRenderingContext2D, offsetX = 0, offsetY = 0, scale: number) => {

        // Store the current transformation matrix
        ctx.save();

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const knowledgePointRadius = 5;

        // Calculate center to scale as the middle of the currently rendere
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        //draw a red dot to show the center of scaling
        ctx.save()
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        //add text
        ctx.font = "20px Arial";
        ctx.fillText("CENTER_OF_SCALING", centerX + 10, centerY + 10);
        ctx.closePath();
        ctx.restore()
        // Drawing lines for visual aid

        // NEW: Move to the center of the canvas to scale from the center
        ctx.translate(centerX, centerY);
        //reset scale
        // ctx.scale(1 / scaleMultiplier, 1 / scaleMultiplier);
        // console.log("Scaling by: ", scale)
        ctx.scale(scale, scale);
        //NEW: move back from the center
        ctx.translate(-centerX + (offset.current.x), -centerY + (offset.current.y));


        // Restore the transform
        // ctx.restore();

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
                ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
                ctx.fillStyle = colours.complementary_lightest;
                ctx.fill();
                ctx.closePath();
            }
        }
        //DRAW PAST KNOWLEDGE POINTS
        if (allKnowledgePoints) {
            allKnowledgePoints.forEach((point, i) => {
                ctx.beginPath();
                ctx.arc(allKnowledgePoints[i].TwoDCoOrdinates[0], allKnowledgePoints[i].TwoDCoOrdinates[1], knowledgePointRadius, 0, 2 * Math.PI);
                ctx.fillStyle = changeColour(colours.complementary).lighten(4).toString();
                ctx.fill();
                ctx.closePath();
            });
        }
        //draw a blue dot at 0,0
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.font = "20px Arial";
        ctx.fillText("ORIGIN", centerX + 10, centerY + 10);
        ctx.closePath();
        //DRAW THE KNOWLDGE POINTS FROM CHAIN
        const potentialPulsingLinks: number[] = []; //links of indexes
        if (knowledgePoints.length > 0) {
            for (let i = 0; i < knowledgePoints.length - 1; i++) { // Stop at the second to last element
                const point = knowledgePoints[i];
                const nextPoint = knowledgePoints[i + 1];
                // Draw line from current point to next
                //at this point, the context is drawing the line. We can change the opacity of the line here, and then reset it after drawing the line
                if (point.confidence === 5 && nextPoint.confidence === 4) {
                    if (potentialPulsingLinks.find(index => index < i) || potentialPulsingLinks.length === 0) {
                        updatePulsateOpacity(frameRate);
                        ctx.globalAlpha = pulsateOpacity; // Apply dynamic opacity for pulsating effect
                        potentialPulsingLinks.push(i)
                    }

                } else {
                    ctx.globalAlpha = 1; // No pulsating effect, fully opaque
                }
                ctx.beginPath();
                ctx.moveTo(centerX + point.TwoDCoOrdinates[0], point.TwoDCoOrdinates[1] + centerY); // Start at current point
                ctx.lineTo(centerX + nextPoint.TwoDCoOrdinates[0], nextPoint.TwoDCoOrdinates[1] + centerY); // Draw line to next point
                ctx.strokeStyle = (nextPoint.confidence <= point.confidence) ? getColourFromConfidence(nextPoint.confidence) : getColourFromConfidence(2); // Use the helper function to get the color
                ctx.stroke();
                ctx.globalAlpha = 1; // Reset global alpha if you've changed it
                //at this point, the context is drawing the node. We can change the opacity of the node here, and then reset it after drawing the node
                if (point.confidence === 4 && nextPoint.confidence === 2) {
                    if (potentialPulsingLinks.find(index => index > i) || potentialPulsingLinks.length === 0) {
                        updatePulsateOpacity(frameRate);
                        ctx.globalAlpha = pulsateOpacity; // Apply dynamic opacity for pulsating effect
                        potentialPulsingLinks.push(i)
                    }

                } else {
                    ctx.globalAlpha = 1; // No pulsating effect, fully opaque
                }
                // Now draw the current point
                ctx.beginPath();
                ctx.arc(point.TwoDCoOrdinates[0] + centerX, point.TwoDCoOrdinates[1] + centerY, 5, 0, 2 * Math.PI);
                ctx.fillStyle = getColourFromConfidence(point.confidence); // Use the helper function to get the color
                ctx.fill();
                ctx.closePath();

                //on hover, show the point's info
                // ctx.font = "20px Arial";
                // ctx.fillText(point.pointInSolitude, point.TwoDCoOrdinates[0] + offsetX, point.TwoDCoOrdinates[1] + offsetY);

            }
            // Draw the last point (since it's not covered in the loop)
            const lastPoint = knowledgePoints[knowledgePoints.length - 1];
            ctx.beginPath();
            ctx.arc(lastPoint.TwoDCoOrdinates[0] + centerX, lastPoint.TwoDCoOrdinates[1] + centerY, 5, 0, 2 * Math.PI);
            ctx.fillStyle = getColourFromConfidence(lastPoint.confidence); // Use the helper function to get the color
            ctx.fill();
            ctx.closePath();
            // Reset global alpha if you've changed it
            ctx.globalAlpha = 1;
            ctx.save()
        }
    };    // Effect hook to adjust initial zoom and position based on knowledgePoints length
    // Animation loop function
    const animate = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not found');
        // console.log("Draw called in animate")

        // Calculate the time elapsed since the last frame
        const timeAtCallOfAnimate = performance.now();
        let deltaTime: number = 0;
        requestAnimationRef.current = requestAnimationFrame(animate);
        // Limit the frame rate to 60 FPS
        while (deltaTime < 1000 / frameRate) {
            deltaTime = performance.now() - timeAtCallOfAnimate;
        }
        updatePulsateOpacity(frameRate); // Update the opacity for pulsating effect
        draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current)
        return () => cancelAnimationFrame(requestAnimationRef.current);
    }
    // Start the animation loop
    useEffect(() => {
        if (knowledgePoints.length > 0) {
            requestAnimationRef.current = requestAnimationFrame(animate); //start animation loop
        }
        return () => cancelAnimationFrame(requestAnimationRef.current);
    }, [knowledgePoints]); // Rerun the effect when knowledgePoints change
    useEffect(() => {
        async function main() {
            const allKp = await getAllReinforcedKnowledgePoints(userId!);
            frameRate = await getRequiredFrameRate();
            console.log("Frame rate used: ", frameRate)
            setAllKnowledgePoints(allKp);
        }
        main()
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])
    const handleResize = (
    ) => {
        // Adjust for device pixel ratio to fix blurriness and make canvas responsive
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not found');
        const dpr = window.devicePixelRatio || 1;

        //TOFIX: rect.width never changes for some reason
        const rect = canvas.getBoundingClientRect();

        // Set the display size of the canvas.
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        // Set the actual, scaled size of the canvas drawing buffer.
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr); // Scale all drawing operations by the dpr, so you don't need to manually scale each draw operation

        // Redraw the canvas content based on the new dimensions
        console.log("Draw called in handleResize")
        draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current);
        console.log("resize fired")
    };
    useEffect(() => {
        // console.log("useEffect called")
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not found');
        // Adjust for device pixel ratio to fix blurriness
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const onMouseDown = (e: MouseEvent) => {
            // console.log("Offset: ", offset.current.x, offset.current.y)
            drag.current.isDragging = true;
            // Store the initial click position relative to the viewport
            drag.current.startX = e.clientX;
            drag.current.startY = e.clientY;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!drag.current.isDragging) return;

            // Calculate the delta between the current mouse position and the initial click position
            const dx = (e.clientX - drag.current.startX) / scaleMultiplier.current;
            const dy = (e.clientY - drag.current.startY) / scaleMultiplier.current;

            // Update the drag start position to the current position
            drag.current.startX = e.clientX;
            drag.current.startY = e.clientY;

            offset.current.x += dx;
            offset.current.y += dy;
            console.log("Draw called in onMouseMove")
            draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current);
        };

        const onMouseUp = () => {
            drag.current.isDragging = false;
            //go back to current knowledge points
            if (knowledgePoints.length > 0) {
                const { overallScale, centerOffsetX, centerOffsetY } = calculateOffsetAndScaleToFocusCurrentChain(ctx, knowledgePoints);
                // offset.current.x = -centerOffsetX;
                // offset.current.y = -centerOffsetY;
                console.log("Scale set by knowledgePoints onMouseUp: ", overallScale)
                // scaleMultiplier.current = overallScale;
                draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current);
            }
        };
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const zoomFactor = 0.1;
            const direction = e.deltaY < 0 ? 1 : -1;
            console.log("Scale set by onWheel: ", scaleMultiplier.current * (1 + zoomFactor * direction))
            scaleMultiplier.current = scaleMultiplier.current * (1 + zoomFactor * direction);
            console.log("Scale: ", scaleMultiplier)
            console.log("Draw called in onWheel")
            draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current);
        };
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('wheel', onWheel);
        console.log("Draw called in general useEffect")
        draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current); // Initial draw
        // Clean up to prevent memory leaks
        return () => {
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            canvas.removeEventListener('wheel', onWheel);
        };
    }, [knowledgePoints]); // Dependency on offset, scale, and knowledgePoints so that 

    return (
        <div className="h-full" style={{ paddingRight: sizing.variableWholePagePadding }}>
            <div className='overflow-hidden w-full h-full rounded-[20px] border-2' style={{ paddingRight: `calc(6* ${sizing.variableWholePagePadding})`, borderColor: '#E8E8E8', backgroundColor: colours.lessonNodes.background }}>
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
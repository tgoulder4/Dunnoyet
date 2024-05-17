import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { colours, changeColour } from '@/lib/constants'
import { sizing } from '@/lib/constants'
import { IKP } from '@/lib/validation/enforceTypes'
import { getEmbedding } from '@/lib/chat/openai'
import { getAllReinforcedKnowledgePoints, getRelatedKnowledgePoints } from '@/lib/chat/Eli/eli'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { getRequiredFrameRate } from './utils/optimisations'
import { calculateOffsetAndScaleToFocusGivenChain, drawKnowledgePointsInChain, frameRate, pulsateDirection, pulsateOpacity, setFrameRate, updatePulsateOpacity } from './utils/core'
import { getColourFromConfidence } from './utils/helpers'
import { drawOtherPoints, drawBackgroundDots, } from './utils/core'

// Props interface declaration for type safety
interface NeuralNetworkProps extends React.HTMLAttributes<HTMLCanvasElement> {
    knowledgePointsToFocus?: IKP[];
    otherPoints: IKP[];
    className?: string;
}

// Example easing function (Ease in-out)
function easeInOut(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ knowledgePointsToFocus, otherPoints, className }) => {
    const sess = useSession().data!.user!;
    const {
        id: userId,
    } = sess;

    const drag = useRef({ isDragging: false, startX: 0, startY: 0 });
    const offset = useRef({ x: 0, y: 0 });
    // console.log("INITIAL DEFINITION Offset: ", offset.current.x, offset.current.y)
    const scaleMultiplier = useRef<number>(0.7);
    console.log("INITIAL DEFINITION ScaleMultiplier: ", scaleMultiplier.current);
    const requestAnimationRef = useRef<any>(null);

    // Function to draw the canvas
    const draw = (ctx: CanvasRenderingContext2D, offsetX = 0, offsetY = 0, scale: number) => {
        // Store the current transformation matrix
        ctx.save();
        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Calculate center to scale as the middle of the currently rendere
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        //draw a red dot to show the center of scaling
        ctx.save()
        ctx.restore()
        // NEW: Move to the center of the canvas to scale from the center
        ctx.translate(centerX, centerY);
        //reset scale
        ctx.scale(scale, scale);
        //NEW: move back from the center
        ctx.translate(-centerX + (offset.current.x), -centerY + (offset.current.y));

        drawBackgroundDots(ctx, centerX, centerY);
        drawOtherPoints(ctx, otherPoints, centerX, centerY);
        if (knowledgePointsToFocus) drawKnowledgePointsInChain(ctx, knowledgePointsToFocus, centerX, centerY);

    };    // Effect hook to adjust initial zoom and position based on knowledgePoints length
    // Animation loop function
    const animate = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not found');
        console.log("Draw called in animate")

        // Calculate the time elapsed since the last frame
        const timeAtCallOfAnimate = performance.now();
        let deltaTime: number = 0;
        requestAnimationRef.current = requestAnimationFrame(animate);
        // Limit the frame rate to 60 FPS
        while (deltaTime < 1000 / frameRate) {
            deltaTime = performance.now() - timeAtCallOfAnimate;
        }
        updatePulsateOpacity(); // Update the opacity for pulsating effect
        draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current)
        return () => cancelAnimationFrame(requestAnimationRef.current);
    }


    // Animation function to smoothly animate to the target offset
    function animateToPositionAndScale(ctx: CanvasRenderingContext2D, targetOffsetX: number, targetOffsetY: number, targetScale: number) {
        const startOffsetX = offset.current.x;
        const startOffsetY = offset.current.y;
        const startScale = scaleMultiplier.current;
        const startTime = performance.now();
        const duration = 500; // milliseconds

        function updatePosition() {
            const currentTime = performance.now();
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
                const progress = Math.min(elapsedTime / duration, 1);
                const easeProgress = easeInOut(progress); // Use your desired easing function
                offset.current.x = startOffsetX + (targetOffsetX - startOffsetX) * easeProgress;
                offset.current.y = startOffsetY + (targetOffsetY - startOffsetY) * easeProgress;
                scaleMultiplier.current = startScale + (targetScale - startScale) * easeProgress;
                // console.log("[animateToPos] ScaleMultiCurrent set to ", scaleMultiplier.current, " targetScale: ", targetScale, " startScale: ", startScale, " easeProgress: ", easeProgress)
                draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current);
                requestAnimationRef.current = requestAnimationFrame(updatePosition);
            } else {
                draw(ctx, targetOffsetX, targetOffsetY, targetScale);
            }
        }

        requestAnimationRef.current = requestAnimationFrame(updatePosition);
        // Uncomment below line if you want to cancel the animation
        return () => cancelAnimationFrame(requestAnimationRef.current);
    }
    useEffect(() => {
        console.log("initial render or re-rendering due to changein KPS")
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
            console.log("Draw called in onMouseMove with centerOffset: ", offset.current.x, offset.current.y, " and mouse position: ", e.clientX, e.clientY, " and scaleMultCurrent: ", scaleMultiplier.current)
            draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current);
        };

        const onMouseUp = () => {
            drag.current.isDragging = false;
            //go back to current knowledge points
            if (knowledgePointsToFocus && knowledgePointsToFocus.length > 0) {
                const { overallScale, centerOffsetX, centerOffsetY } = calculateOffsetAndScaleToFocusGivenChain(ctx, knowledgePointsToFocus);
                const targetOffsetX = -centerOffsetX;
                const targetOffsetY = -centerOffsetY;
                animateToPositionAndScale(ctx, targetOffsetX, targetOffsetY, scaleMultiplier.current);
                console.log("Scale set by knowledgePoints onMouseUp: ", overallScale)
            }
        };
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const zoomFactor: number = 0.1;
            const direction: number = e.deltaY < 0 ? 1 : -1;
            console.log("Scale set by onWheel: ", scaleMultiplier.current * (1 + zoomFactor * direction))
            scaleMultiplier.current = scaleMultiplier.current * (1 + zoomFactor * direction);
            console.log("[ONWHEEL] ScaleMultiplier set to: ", scaleMultiplier.current, " zoomFactor: ", zoomFactor, " direction: ", direction)
            console.log("Draw called in onWheel")
            draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current);
        };
        const onResize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current);
        };

        if (knowledgePointsToFocus && knowledgePointsToFocus.length > 0) {
            const { overallScale, centerOffsetX, centerOffsetY } = calculateOffsetAndScaleToFocusGivenChain(ctx, knowledgePointsToFocus);
            const targetOffsetX = -centerOffsetX;
            const targetOffsetY = -centerOffsetY;
            animateToPositionAndScale(ctx, targetOffsetX, targetOffsetY, overallScale);
            console.log("Scale set by knowledgePoints useEffect: ", overallScale)
        }
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('wheel', onWheel);
        window.addEventListener('resize', onResize);
        draw(ctx, offset.current.x, offset.current.y, scaleMultiplier.current); // Initial draw
        // Clean up to prevent memory leaks
        return () => {
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            canvas.removeEventListener('wheel', onWheel);
        };
    }, [knowledgePointsToFocus]);

    return (
        <div className={`${className} h-full`} >
            <div className='overflow-hidden w-full h-72 rounded-[20px] grid place-items-center' style={{ backgroundColor: changeColour(colours.complementary_lightest).lighten(8).toString() }}>
                {/* dynamic tailwind classes don't render unless we explicitly define them: */}
                <div className="hidden bg-opacity-50 animate-pulse"></div>
                <canvas className='w-full h-full overflow-hidden' id="canvas" />

                {/* <line x1="0" y1="0" x2="200" y2="100" className="w-1 bg-red-500" /> */}
            </div>
        </div>
    )
}


export default NeuralNetwork
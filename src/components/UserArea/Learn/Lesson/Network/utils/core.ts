import { changeColour, colours } from '@/lib/constants';

import { IKP } from './../../../../../../lib/validation/enforceTypes';
import { getColourFromConfidence } from './helpers';
export let pulsateOpacity = 1;
export let pulsateDirection = true; // true for increasing, false for decreasing
export let frameRate = 60; // Default frame rate
export function setFrameRate(newFrameRate: number) {
    frameRate = newFrameRate;
}
// Function to update the opacity by 1 step for pulsating effect
export const updatePulsateOpacity = () => {
    const speed = 1 / frameRate;
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
export const step = 10;
export function drawBackgroundDots(ctx: CanvasRenderingContext2D, focusPoints: IKP[], centerX: number, centerY: number) {
    //find the range we need to make the dots
    const xValues = focusPoints.map(point => point.TwoDvK[0]);
    // console.log("xValues: ", xValues)
    const yValues = focusPoints.map(point => point.TwoDvK[1]);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    let xRange = maxX - minX; if (xRange < 1) xRange = 1; // Prevent division by zero (or close to zero)
    let yRange = maxY - minY; if (yRange < 1) yRange = 1; // Prevent division by zero (or close to zero)
    let width = 15 * xRange; if (width > ctx.canvas.width) width = ctx.canvas.width;
    let height = 15 * yRange; if (height > ctx.canvas.height) height = ctx.canvas.height;
    const dotSize = 1;
    //DRAW THE BACKGROUND: draw loads of small dots of colour complementary
    for (let x = -width / 2; x < width / 2; x += step) {
        for (let y = -height / 2; y < height / 2; y += step) {
            ctx.beginPath();
            ctx.arc(x + centerX, y + centerY, dotSize, 0, 2 * Math.PI);
            ctx.fillStyle = colours.lessonNodes.background;
            ctx.fill();
            ctx.font = "2px Arial";
            // ctx.fillText("x:" + x + " y:" + y, x + centerX, y + centerY);
            //make font size way smaller
            ctx.closePath();
        }
    }
}
export function drawOtherPoints(ctx: CanvasRenderingContext2D, knowledgePointsExceptFromChain: IKP[] | null, centerX: number, centerY: number) {
    //DRAW ALL OTHER KNOWLEDGE POINTS EXCEPT FROM CHAIN
    const knowledgePointRadius = 1;
    if (knowledgePointsExceptFromChain) {
        knowledgePointsExceptFromChain.forEach((point, i) => {
            ctx.beginPath();
            ctx.arc(knowledgePointsExceptFromChain[i].TwoDvK[0] + centerX, knowledgePointsExceptFromChain[i].TwoDvK[1] + centerY, knowledgePointRadius, 0, 2 * Math.PI);
            ctx.fillStyle = changeColour(colours.primary).lighten(20).toString();
            ctx.fill();
            ctx.closePath();
        });
    }
}
// Function to calculate boundaries
/**
 * 
 * @param ctx 
 * @param points Scales to focus on these points
 * @returns 
 */
export const calculateOffsetAndScaleToFocusGivenChain = (ctx: CanvasRenderingContext2D, points: IKP[]) => {
    const xValues = points.map(point => point.TwoDvK[0]);
    // console.log("xValues: ", xValues)
    const yValues = points.map(point => point.TwoDvK[1]);
    // console.log("Points being focused on: ", points)
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    let xRange = maxX - minX; if (xRange < 1) xRange = 1; // Prevent division by zero (or close to zero)
    let yRange = maxY - minY; if (yRange < 1) yRange = 1; // Prevent division by zero (or close to zero)
    // console.log("minX: ", minX, " maxX: ", maxX, " minY: ", minY, " maxY: ", maxY, " xRange: ", xRange, " yRange: ", yRange)
    const overallScale = Math.max(ctx.canvas.width * 0.08 / xRange, ctx.canvas.height * 0.08 / yRange);
    // console.log("overallScale: ", overallScale, " ctx.canvas.width: ", ctx.canvas.width, " ctx.canvas.height: ", ctx.canvas.height, " xRange: ", xRange, " yRange: ", yRange)
    const centerOffsetX = minX + (xRange / 2);
    const centerOffsetY = minY + (yRange / 2);
    // console.log("centerOffsetX: ", centerOffsetX, " centerOffsetY: ", centerOffsetY)
    return { centerOffsetX, centerOffsetY, overallScale };
};
export function addEventListeners(window: Window & typeof globalThis, canvas: HTMLCanvasElement) {

}
export function drawKnowledgePointsInChain(ctx: CanvasRenderingContext2D, knowledgePoints: IKP[], centerX: number, centerY: number) {
    //DRAW THE KNOWLDGE POINTS FROM CHAIN
    const dotSize = 1.2;
    const potentialPulsingLinks: number[] = []; //links of indexes
    if (knowledgePoints.length > 0) {
        for (let i = 0; i < knowledgePoints.length - 1; i++) { // Stop at the second to last element
            const point = knowledgePoints[i];
            const nextPoint = knowledgePoints[i + 1];
            // Draw line from current point to next
            //at this point, the context is drawing the line. We can change the opacity of the line here, and then reset it after drawing the line
            if (point.confidence === 5 && nextPoint.confidence === 4) {
                if (potentialPulsingLinks.find(index => index < i) || potentialPulsingLinks.length === 0) {
                    updatePulsateOpacity();
                    ctx.globalAlpha = pulsateOpacity; // Apply dynamic opacity for pulsating effect
                    potentialPulsingLinks.push(i)
                }

            } else {
                ctx.globalAlpha = 1; // No pulsating effect, fully opaque
            }
            ctx.beginPath();
            ctx.moveTo(centerX + point.TwoDvK[0], point.TwoDvK[1] + centerY); // Start at current point
            ctx.lineTo(centerX + nextPoint.TwoDvK[0], nextPoint.TwoDvK[1] + centerY); // Draw line to next point
            ctx.strokeStyle = (nextPoint.confidence <= point.confidence) ? getColourFromConfidence(nextPoint.confidence) : getColourFromConfidence(2); // Use the helper function to get the color
            ctx.stroke();
            ctx.globalAlpha = 1; // Reset global alpha if you've changed it
            //at this point, the context is drawing the node. We can change the opacity of the node here, and then reset it after drawing the node
            if (point.confidence === 4 && nextPoint.confidence === 2) {
                if (potentialPulsingLinks.find(index => index > i) || potentialPulsingLinks.length === 0) {
                    updatePulsateOpacity();
                    ctx.globalAlpha = pulsateOpacity; // Apply dynamic opacity for pulsating effect
                    potentialPulsingLinks.push(i)
                }

            } else {
                ctx.globalAlpha = 1; // No pulsating effect, fully opaque
            }
            // Now draw the current point
            ctx.beginPath();
            ctx.arc(point.TwoDvK[0] + centerX, point.TwoDvK[1] + centerY, dotSize, 0, 2 * Math.PI);
            ctx.fillStyle = getColourFromConfidence(point.confidence); // Use the helper function to get the color
            ctx.fill();
            ctx.closePath();

            //on hover, show the point's info
            // ctx.font = "20px Arial";
            // ctx.fillText(point.pointInSolitude, point.TwoDvK[0] + offsetX, point.TwoDvK[1] + offsetY);

        }
        // Draw the last point (since it's not covered in the loop)
        const lastPoint = knowledgePoints[knowledgePoints.length - 1];
        ctx.beginPath();
        ctx.arc(lastPoint.TwoDvK[0] + centerX, lastPoint.TwoDvK[1] + centerY, dotSize, 0, 2 * Math.PI);
        ctx.fillStyle = getColourFromConfidence(lastPoint.confidence); // Use the helper function to get the color
        ctx.fill();
        ctx.closePath();
        // Reset global alpha if you've changed it
        ctx.globalAlpha = 1;
        ctx.save()
    }
}
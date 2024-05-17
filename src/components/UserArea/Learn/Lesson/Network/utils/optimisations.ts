import { MutableRefObject } from "react";

var t: Array<number> = [];
//being more resource friendly by only calculating the required frame rate. Draw updates ALOT and for some requestAnimationFrame affects the whole page's frame rate.
//this is responsible for laggy scrollbar. scrollbar click events are disabled as a result
export const getRequiredFrameRate = (requestAnimationRef: MutableRefObject<any>, frameRate: number) => new Promise<number>((resolve, reject) => {
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
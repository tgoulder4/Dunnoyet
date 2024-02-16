"use client"
import React, { useState, useEffect } from 'react'
import { ITip } from '@/lib/validation/enforceTypes'
import { getTips } from '@/actions'
import { changeColour, colours, spacing } from '@/lib/constants';
var equal = require('deep-equal');
function Tip() {
    const [tip, setTip] = useState(null as ITip | undefined | null);
    let randomTipNumber = 0;
    useEffect(() => {
        async function main() {
            // const tips = await getTips();
            // if (tips == null) {
            //     setTip(undefined)
            //     return
            // };
            // if (tips.length == 0) {
            //     setTip(null)
            //     return
            // }
            const tips: ITip[] = [
                {
                    title: "Pro Tip",
                    content: "You can use the 'Continue Lesson' button to continue from where you left off",
                    link: "https://www.google.com"
                },
                {
                    title: "Pro Tip",
                    content: "RAWRYou can use the 'Continue Lesson' button to continue from where you left off",
                    link: "https://www.google.com"
                },
                {
                    title: "Pro Tip",
                    content: "SLAYYYYou can use the 'Continue Lesson' button to continue from where you left off",
                    link: "https://www.google.com"
                },
                {
                    title: "Pro Tip",
                    content: "WOOFYou can use the 'Continue Lesson' button to continue from where you left off",
                    link: "https://www.google.com"
                },
                {
                    title: "Pro Tip",
                    content: "BARK BARK You can use the 'Continue Lesson' button to continue from where you left off",
                    link: "https://www.google.com"
                },
                {
                    title: "Pro Tip",
                    content: "MEOWWWYou can use the 'Continue Lesson' button to continue from where you left off",
                    link: "https://www.google.com"
                },
            ]
            console.log("tips from server", tips);
            randomTipNumber = Math.floor(Math.random() * tips.length) + 1;
            setTip(tips[randomTipNumber]);
        }
        //perform this on every render
        main()
    }, [])
    const bgc = changeColour(colours.primary).lighten(2);
    return (
        tip !== null && tip !== undefined ?
            <div className='w-96 flex flex-col justify-between items-center rounded-[10px]' style={{ backgroundColor: bgc.toString() }}>
                <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
                    <div className="grid place-items-center px-3 py-2 w-fit rounded-lg text-white" style={{ backgroundColor: bgc.lighten(10).toString() }}><h3>PRO TIP</h3></div>
                    <h3>{tip.content}</h3>
                </div>
            </div>
            : tip == null ? <div className='w-24 h-full rounded-[10px] animate-pulse bg-gray-300'></div> : <div className='w-24 h-full rounded-[10px] animate-pulse bg-gray-300'></div>
    )
}

export default Tip
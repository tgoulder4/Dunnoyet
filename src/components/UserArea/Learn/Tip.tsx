import React, { useEffect, useState } from 'react'
import { getTips } from '@/actions'
import { changeColour, colours, spacing } from '@/lib/constants';
var equal = require('deep-equal');
export default function Tip() {
    const [tip, setTip] = useState<any>(null);
    useEffect(() => {
        async function main() {
            console.log("Tip calling getTips...")
            const tips = await getTips();
            console.log("Tips returned from getTips: ", tips)
            if (tips == null) return;
            if (equal(tips)) return;
            const randomTipNumber = Math.floor(Math.random() * tips.length) + 1;
            console.log(tips[randomTipNumber])
            setTip(tips[randomTipNumber]);
        }
        main()
    })
    // const tips = await getTips();
    // if (tips == null) return null;
    // if (equal(tips)) return null;
    // const randomTipNumber = Math.floor(Math.random() * tips.length) + 1;
    // const tip = tips[randomTipNumber];
    const bgc = changeColour(tip ? colours.primary : colours.accent).lighten(tip ? 2 : 0);
    return (
        <div className='flex-auto max-w-lg flex flex-col justify-between items-center rounded-[10px]' style={{ backgroundColor: bgc.toString(), padding: spacing.padding.normalY }}>
            <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
                <div className={`grid place-items-center py-2 ${tip ? "px-3" : ""} w-fit rounded-lg ${tip ? "text-white" : "text-[#131313]"} font-bold`} style={{ backgroundColor: tip ? bgc.lighten(10).toString() : 'transparent' }}><h3>{tip ? "PRO TIP" : "Tips will appear here"}</h3></div>
                <h3>{tip ? tip.content : "Check back later for personalised suggestions made to help you master the act of learning. "}</h3>
            </div>
        </div>
    )
}

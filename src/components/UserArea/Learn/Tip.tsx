"use client"
import React, { useState, useEffect } from 'react'
import { ITip } from '@/lib/validation/enforceTypes'
import { getTips } from '@/actions'
var equal = require('deep-equal');
function Tip() {
    const [tips, setTips] = useState(null as ITip[] | [] | null);
    let randomTipNumber = 0;
    useEffect(() => {
        async function main() {
            const tips = await getTips();
            console.log("tips from server", tips);
            if (tips) randomTipNumber = Math.floor(Math.random() * tips.length) + 1;
            setTips(tips);
        }
        //perform this on every render
        main()
    }, [])
    return (
        tips !== null && tips.length > 0 ? <h1>TIp!</h1> : equal(tips, []) ? <p>No tips available</p> : <p>Loading...</p>
    )
}

export default Tip
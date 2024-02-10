"use client"
import { sizing } from '@/lib/constants'
import React, { useCallback, useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

function DisplacingButton({ text, children, tooltip }: { text?: string, children?: React.ReactNode, tooltip?: string }) {
    const [state, setState] = useState("inactive");
    const getOffset = useCallback(() => {
        switch (state) {
            case "inactive":
                return 0
            case "hovering":
                return 2
            case "clicking":
                return 4
            default:
                return 0
        }
    }, [state])
    function commonContent() {
        return (
            <div style={{ borderRadius: 10, offset: getOffset() }} className='flex flex-row' onMouseEnter={() => setState("hovering")} onMouseLeave={() => setState("inactive")} onMouseDown={() => setState("clicking")}>{
                text ? <h2 style={{ fontSize: sizing.globalFontSize }}>{text}</h2> : children}</div>
        )
    }
    return (<>
        {
            tooltip ?
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>{commonContent()}</TooltipTrigger>
                        <TooltipContent>
                            {typeof tooltip === "string" ? <p>{tooltip}</p> : tooltip}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                : commonContent()
        }

    </>
    )
}

export default DisplacingButton
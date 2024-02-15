"use client"
import { sizing } from '@/lib/constants'
import React, { useCallback, useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { TinyColor } from '@ctrl/tinycolor';
function DisplacingButton({ backgroundColour, text, children, tooltip }: { backgroundColour: string, text?: string, children?: React.ReactNode, tooltip?: string }) {
    const color = new TinyColor(backgroundColour);
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
            <div style={{ backgroundColor: backgroundColour, boxShadow: '0px 6px 0px 0px rgba(0, 0, 0, 0.25)' + color.darken(25).toString(), borderRadius: 10, offset: getOffset() }} className='flex flex-0 flex-row px-[28px] py-[8px]' onMouseEnter={() => setState("hovering")} onMouseLeave={() => setState("inactive")} onMouseDown={() => setState("clicking")}>{
                text ? <h2 style={{ color: color.isDark() ? '#FFF' : '#000', fontSize: sizing.globalFontSize }}>{text}</h2> : children}</div>
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
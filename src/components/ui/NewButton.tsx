"use client"
import { VariantProps } from 'class-variance-authority'
import React, { ButtonHTMLAttributes, CSSProperties, ReactNode, useState } from 'react'
import { buttonVariants } from './button'
import { colours, spacing } from '@/lib/constants'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TinyColor } from '@ctrl/tinycolor'
import { Slot } from "@radix-ui/react-slot";
interface buttonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    buttonVariant: "black" | "primary" | "white" | "ghost",
    children?: React.ReactNode,
    style?: CSSProperties,
    text?: string,
    icon?: ReactNode,
    tooltip?: string,
    actionOrLink?: (() => void) | string,
    className?: string
    textColour?: string
    noAnimation?: boolean
    asChild?: boolean,
    pings?: boolean
}
const NewButton = React.forwardRef<HTMLButtonElement, buttonProps>(
    ({
        buttonVariant,
        children,
        style,
        text,
        icon,
        tooltip,
        actionOrLink,
        className,
        textColour,
        noAnimation,
        asChild = false,
        pings,
        ...props
    }, ref) => {
        let bgColour = "";
        const [hovered, setHovered] = useState(false);
        switch (buttonVariant) {
            case "black":
                bgColour = "#131313";
                break;
            case "primary":
                bgColour = colours.primary;
                break;
            case "white":
                bgColour = "#fff";
                break;
            case "ghost":
                bgColour = "rgba(0,0,0,0)"
        }
        const bgc = new TinyColor(bgColour);
        const Comp = Slot;
        return (
            // <button>
            <Comp ref={ref} className='relative' title={tooltip}>
                {
                    typeof actionOrLink === 'string' ?
                        <Link className={`${className} ${!noAnimation ? "w-fit hover:scale-105 transition-transform" : ""} 
                    flex flex-row gap-3 justify-center items-center px-[16px] py-[8px] hover:underline 
                    rounded-[10px] whitespace-nowrap`}
                            href={actionOrLink}
                            style={{ ...style, color: textColour ? textColour : buttonVariant !== "ghost" ? bgc.isDark() ? "white" : "black" : '#000', backgroundColor: hovered ? bgc.darken(4).toString() : bgColour }}
                            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>{text} {children}
                            {pings ?
                                <div className='w-3/5 h-3/5 absolute z-[-1] rounded-[5px] animate-ping ping bg-black'></div> : <></>}
                        </Link>
                        :
                        <button
                            style={{ ...style, color: textColour ? textColour : buttonVariant !== "ghost" ? bgc.isDark() ? "white" : "black" : '#000', backgroundColor: hovered ? bgc.darken(4).toString() : bgColour }}
                            onClick={actionOrLink}
                            {...props}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            className={`${className} ${!noAnimation ? "relative disabled:opacity-50 disabled:hover:scale-100 hover:scale-105 disabled:transition-none transition-transform" : ""} 
                    flex flex-row gap-3 justify-center items-center px-[16px] py-[8px] hover:underline 
                    rounded-[10px] whitespace-nowrap`}>
                            {text} {children}
                            {pings ?
                                <div className='w-3/5 h-3/5 absolute z-[-1] rounded-[5px] animate-ping bg-black'></div> : <></>}
                        </button>
                }


            </Comp>
            // </button>
        )
    })

export default NewButton
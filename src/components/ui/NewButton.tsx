"use client"
import { VariantProps } from 'class-variance-authority'
import React, { ButtonHTMLAttributes, CSSProperties, ReactNode, useState } from 'react'
import { buttonVariants } from './button'
import { colours, spacing } from '@/lib/constants'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TinyColor } from '@ctrl/tinycolor'

interface buttonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    buttonVariant: "black" | "primary" | "white" | "ghost",
    children?: React.ReactNode,
    style?: CSSProperties,
    text?: string,
    icon?: ReactNode,
    tooltip?: string,
    actionOrLink: (() => void) | string,
    className?: string
    textColour?: string
    noAnimation?: boolean
}
function NewButton({
    buttonVariant,
    children,
    style,
    text,
    icon,
    tooltip,
    actionOrLink,
    className,
    textColour,
    noAnimation
}: buttonProps) {
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
    return (
        <Link style={{ ...style, color: textColour ? textColour : bgColour !== "rgba(0,0,0,0)" ? bgc.isDark() ? "white" : "black" : '#000', backgroundColor: hovered ? bgc.darken(4).toString() : bgColour }} onClick={typeof actionOrLink === 'function' ? () => actionOrLink() : () => { }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} href={
            typeof actionOrLink === 'string' ? actionOrLink : "#"
        } className={`${className} ${!noAnimation ? "hover:scale-105 transition-transform" : ""} flex flex-row gap-3 justify-center items-center px-[16px] py-[8px] w-fit hover:underline rounded-[10px]`}>
            {text} {children}
        </Link>
    )
}

export default NewButton
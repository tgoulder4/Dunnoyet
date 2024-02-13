import "../globals.css";
import { DunnoyetLogo, colours, sizing, spacing } from '@/lib/constants'
import React from 'react'
import NewButton from '@/components/ui/NewButton'
import UserAuthButton from '@/components/Navbar/UserAuthButton'
import { TinyColor } from '@ctrl/tinycolor'
import { ruda } from '@/app/fonts'

const bgColour = new TinyColor(colours.primary);
function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-full" style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
            <nav style={{ backgroundColor: colours.accent }} className="flex flex-row justify-start items-center h-[70px]">
                <div className="leftSide flex items-center h-full" style={{ paddingLeft: 2 * spacing.gaps.largest - 12, columnGap: spacing.gaps.groupedElement }}>
                    <NewButton buttonVariant="ghost" actionOrLink="/"> {DunnoyetLogo({ colour: colours.primary })}</NewButton>
                </div>
            </nav>
            <div className="flex items-center justify-center h-full">
                {children}
            </div>
        </div>
    )
}

export default layout
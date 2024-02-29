import "../globals.css";
import { DunnoyetLogo, colours, sizing, spacing } from '@/lib/constants'
import React from 'react'
import NewButton from '@/components/ui/NewButton'
import { ruda } from '@/app/fonts'

function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-[100vh]">
            <div className="flex flex-col h-full" style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
                <nav style={{ backgroundColor: colours.accent }} className="flex flex-row justify-start items-center h-[70px]">
                    <div className="leftSide flex items-center h-full" style={{ paddingLeft: spacing.gaps.separateElement, paddingRight: spacing.gaps.separateElement, columnGap: spacing.gaps.groupedElement }}>
                        <NewButton style={{ paddingLeft: 0 }} buttonVariant="ghost" actionOrLink="/"> {DunnoyetLogo({ colour: colours.primary })}</NewButton>
                    </div>
                </nav>
                <div className="flex items-center justify-center h-full w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default layout
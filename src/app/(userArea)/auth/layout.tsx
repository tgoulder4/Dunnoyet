import { DunnoyetLogo, colours, spacing } from '@/lib/constants'
import React from 'react'
import NewButton from '@/components/ui/NewButton'
import UserAuthButton from '@/components/Navbar/UserAuthButton'
import { TinyColor } from '@ctrl/tinycolor'
const bgColour = new TinyColor(colours.primary);
function layout({ children }: { children: React.ReactNode }) {
    return (<>
        <nav style={{ backgroundColor: colours.accent }} className="flex flex-row justify-start items-center h-[70px] px-16">
            <div className="leftSide flex items-center h-full" style={{ paddingLeft: spacing.padding.normalX, columnGap: spacing.gaps.groupedElement }}>
                <NewButton buttonVariant="ghost" actionOrLink="/"> {DunnoyetLogo({ colour: 'primary' })}</NewButton>
            </div>
        </nav>
        {children}
    </>
    )
}

export default layout
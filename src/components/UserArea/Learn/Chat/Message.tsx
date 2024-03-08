import { spacing } from '@/lib/constants'
import React, { ReactNode } from 'react'

function Message({ children, style, className }: { children: ReactNode, style: React.CSSProperties, className?: string }) {
    return (
        <div className={`${className} p-[24px] flex flex-col rounded-[20px] mb-5`} style={{ ...style, rowGap: spacing.gaps.separateElement / 2 }}>
            {children}
        </div>
    )
}

export default Message
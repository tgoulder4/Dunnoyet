import React, { ReactNode } from 'react'

function Message({ children, style, className }: { children: ReactNode, style: React.CSSProperties, className?: string }) {
    return (
        <div className={`${className} p-[20px] rounded-[20px]`} style={style}>
            {children}
        </div>
    )
}

export default Message
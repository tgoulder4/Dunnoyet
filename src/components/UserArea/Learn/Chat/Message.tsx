import React, { ReactNode } from 'react'

function Message({ children, style }: { children: ReactNode, style: React.CSSProperties }) {
    return (
        <div className='p-4 rounded-[10px]' style={style}>
            {children}
        </div>
    )
}

export default Message
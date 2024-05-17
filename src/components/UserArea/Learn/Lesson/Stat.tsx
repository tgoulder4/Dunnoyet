import { uiBorder } from '@/lib/constants'
import React from 'react'
interface statProps extends React.HTMLAttributes<HTMLDivElement> {
    // You can add other custom props here if needed
    loading: boolean,
    statTitle: string,
    value: number
}
const Stat: React.FC<statProps> = ({ children, className, loading, statTitle, value, ...props }) => {
    return (
        <div style={{ border: uiBorder(0.2) }} className='w-full p-12 rounded-xl flex flex-col gap-3'>
            {loading ? <div className='flex flex-col gap-3'><div className="animate animate-pulse w-1/2 h-10 rounded-lg bg-slate-200" /><div className='animate animate-pulse rounded-lg w-3/4 h-6 bg-slate-200' /></div> :
                <div className='flex flex-col gap-3'><h1 className='value text-3xl font-semibold'>{value}</h1>
                    <h2 className='text-muted-foreground'>{statTitle}</h2></div>}
        </div>
    )
}

export default Stat
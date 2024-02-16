'use client'
import { merriweather } from '@/app/fonts';
import { colours, spacing } from '@/lib/constants'
import Image from "next/legacy/image";
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function SummaryItem({ number, desc, loading }: { number?: number, desc?: string, loading?: boolean }) {
    const [hovered, setHovered] = useState(false);
    return (<>{
        loading ? <div className="flex flex-row gap-0 w-[16rem] h-56 bg-gray-300 animate-pulse rounded-[10px]"></div> : <Link href={`#`}>
            <div className="flex flex-row gap-0 w-[16rem] h-56" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
                borderRadius: '10px',
                border: '1px solid rgba(0, 0, 0, 0.20)',
                background: '#FFF',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 0.1px'
            }}>
                <summary className='flex flex-col' style={{ padding: spacing.padding.normalY, rowGap: spacing.gaps.groupedElement }}>
                    <h1 className='text-[2.625rem]' style={{ fontFamily: merriweather.style.fontFamily, fontWeight: 400 }}>{number}</h1>
                    <h2>{desc}</h2>
                </summary>
            </div>
        </Link>
    }

    </>
    )
}

export default SummaryItem
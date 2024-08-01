import React from 'react'
import { Button } from "@/components/Navbar/button";
import { merriweather, ruda } from '../../app/fonts'
import { colours, maxLandingWidth, spacing } from '../../lib/constants'
import Laptop from './Laptop'
import Link from 'next/link'
import NewButton from '../ui/NewButton';
import { MacbookScroll } from '@/components/ui/macbookScroll'
function MainTitleArea() {
    return (<>
        <section style={{ paddingLeft: spacing.padding.normalY, paddingRight: spacing.padding.normalY, maxWidth: maxLandingWidth, rowGap: spacing.gaps.largest - 20 }} className="flex flex-col justify-between items-center sm:w-inherit w-full">
            <article
                style={{ rowGap: spacing.gaps.groupedElement }} className={`${merriweather.className} flex-1 flex flex-col w-full`}
            >
                <div className="h-full">
                    <h1
                        id="mainTitle"
                        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                        className={`${ruda.className} relative text-center font-bold leading-[1.4] z-20`}
                    >
                        Now THIS is learning.
                    </h1>
                </div>
                <h2 className={`mb-2 text-center ${ruda.className}`}>
                    Learn 10x faster than ever before with linked learning. Only on Dunnoyet.
                </h2>
                <h2 className={`mt-[-22px] grid place-items-center ${ruda.className}`}><a href='/learn/try' className='font-bold underline'>Try it free ↑</a></h2>
                <div className="grid place-items-center">
                    <NewButton className='text-2xl px-[30px] py-[15px] font-bold' buttonVariant='black' actionOrLink="/home">Learn now</NewButton>
                </div>
            </article>
        </section>
        <div className="bg-primary w-[100vw] p-8">
            <MacbookScroll />
        </div></>
    )
}

export default MainTitleArea
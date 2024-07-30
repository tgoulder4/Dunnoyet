import React from 'react'
import { Button } from "@/components/Navbar/button";
import { merriweather, ruda } from '../../app/fonts'
import { colours, maxLandingWidth, spacing } from '../../lib/constants'
import Laptop from './Laptop'
import Link from 'next/link'
import NewButton from '../ui/NewButton';

function MainTitleArea() {
    return (
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
                        <svg style={{
                            width: "100px",
                            height: "clamp(1.5rem, 4.5vw, 3.8rem)",
                            top: "clamp(0.5rem, 3.7vw, 6rem)",
                            left: "clamp(17rem, 4.5vw, 3.8rem)",
                            position: "absolute",
                        }} viewBox="0 0 151 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 8C37.2867 8 67.5672 7.63789 97.8403 7.42857C113.212 7.32228 128.647 7 144 7" stroke="#5C6DFF" strokeWidth="14" strokeLinecap="round" />
                        </svg>

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
            <Laptop />
        </section>
    )
}

export default MainTitleArea
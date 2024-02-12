import React from 'react'
import { Button } from "@/components/Navbar/button";
import { merriweather } from '../../app/fonts'
import { colours, maxLandingWidth, spacing } from '../../lib/constants'
import Laptop from './Laptop'
import Link from 'next/link'
import NewButton from '../ui/NewButton';

function MainTitleArea() {
    return (
        <section style={{ paddingLeft: spacing.padding.normalY, paddingRight: spacing.padding.normalY, maxWidth: maxLandingWidth, rowGap: spacing.gaps.largest }} className="flex flex-col justify-between items-center sm:w-inherit w-full">
            <article
                style={{ rowGap: spacing.gaps.groupedElement }} className={`${merriweather.className} flex-1 flex flex-col w-full`}
            >
                <div className="h-full w-11/12">
                    <h1
                        id="mainTitle"
                        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                        className={`${merriweather.className} relative text-[5vw]  leading-[1.4] z-20`}
                    >
                        Learn anything in serious depth in less than 1 minute with dunnoyet.
                        <div style={{
                            width: "clamp(3.5rem, 45vw, 36rem)",
                            height: "clamp(1.5rem, 4.5vw, 3.8rem)",
                            top: "clamp(1.5rem, 7.7vw, 6rem)"
                        }}
                            id="block"
                            className="hidden textBreak:block absolute bg-complementary_lightest left-0 z-[-1]"
                        ></div>
                    </h1>
                </div>
                {/* <h2 className={`mb-2 ${ruda.className}`}>
            Turn any educative material into content tailored to your individual
            understanding.
          </h2> */}
                <div className="flex gap-2">
                    <NewButton className='text-2xl px-[28px] py-[14px] font-bold' buttonVariant='primary' actionOrLink="/learn">Try One Question Free</NewButton>
                </div>
            </article>
            <Laptop />
        </section>
    )
}

export default MainTitleArea
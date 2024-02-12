import React from 'react'
import { Button } from "@/components/Navbar/button";
import { merriweather } from '../../app/fonts'
import { colours, maxLandingWidth, spacing } from '../../lib/constants'
import Laptop from './Laptop'
import Link from 'next/link'

function MainTitleArea() {
    return (
        <section style={{ paddingLeft: spacing.padding.normalY, paddingRight: spacing.padding.normalY, maxWidth: maxLandingWidth }} className="flex flex-col justify-between items-center gap-5 sm:w-inherit w-full">
            <article
                className={`${merriweather.className} flex-1 flex flex-col gap-2 w-full`}
            >
                <div className="h-full w-11/12">
                    <h1
                        id="mainTitle"
                        style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                        className={`${merriweather.className} relative text-[5vw]  leading-[1.4] z-20`}
                    >
                        Learn anything in serious depth in less than 1 minute with dunnoyet.
                        <div
                            id="block"
                            className="bg-complementary_lightest w-[38vw] h-6 absolute top-[76px] left-0 z-[-1]"
                        ></div>
                    </h1>
                </div>
                {/* <h2 className={`mb-2 ${ruda.className}`}>
            Turn any educative material into content tailored to your individual
            understanding.
          </h2> */}
                <div className="flex gap-2">
                    <Button
                        variant="link"
                        className={`${merriweather.className}`}
                        style={{ backgroundColor: colours.primary }}
                    >
                        <Link className={`font-bold text-xl`} href="/learn">
                            Try One Question Free
                        </Link>
                    </Button>
                </div>
            </article>
            <Laptop />
        </section>
    )
}

export default MainTitleArea
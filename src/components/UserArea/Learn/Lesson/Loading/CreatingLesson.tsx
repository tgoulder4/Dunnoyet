'use client'
import React, { useEffect } from 'react'
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar'
import { colours, spacing } from '@/lib/constants'


function CreatingLesson() {
    const random = Math.floor(Math.random() * 4);
    const isFirstTimer = true;
    //create sayings for the loading screen - all synonyms for what question do you have. All diferently pharsed. Don't start with WHat's
    const sayings = isFirstTimer ? [
        //sayings for the first time users
        // Sayings for the first time users
        "What's on your mind?",
        "Get your burning questions ready...",
        "Let's embark on this learning adventure!",
        "Knowledge awaits!",
    ] : [
        //sayings for returning users
        "What's on your mind this time?",
        "Enjoying Dunnoyet? Spread the word!",
        "Great to see you again! What facts will we discover today?",
        "Welcome back! Let's continue our journey!",
        "Tell your teacher about Dunnoyet for 20% off your subscription!"
    ]
    const saying = sayings[random];
    return (
        <>
            <div className='w-full h-4/5 grid place-items-center'><div style={{ rowGap: spacing.gaps.largest }} className="spinner flex flex-col items-center">
                <div style={{ rowGap: spacing.gaps.largest - 20 }} className='flex flex-col items-center justify-center'>
                    <svg className='h-12 w-12 animate-spin' width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M36.639 5.60895C39.5795 6.7434 42.2677 8.44592 44.5502 10.6193C46.8327 12.7927 48.6648 15.3943 49.9419 18.2757C51.2189 21.1571 51.9159 24.2619 51.9931 27.4126C52.0703 30.5634 51.5261 33.6985 50.3916 36.639C49.2572 39.5795 47.5547 42.2677 45.3813 44.5502C43.2079 46.8327 40.6063 48.6648 37.7249 49.9419C34.8435 51.2189 31.7387 51.9159 28.5879 51.9931C25.4372 52.0703 22.302 51.5261 19.3616 50.3916C16.4211 49.2572 13.7329 47.5547 11.4503 45.3813C9.16784 43.2079 7.33576 40.6063 6.05871 37.7249C4.78166 34.8435 4.08465 31.7387 4.00748 28.588C3.93031 25.4372 4.47448 22.3021 5.60894 19.3616C6.74339 16.4211 8.4459 13.7329 10.6193 11.4504C12.7926 9.16786 15.3943 7.33578 18.2757 6.05873C21.1571 4.78168 24.2618 4.08467 27.4126 4.0075C30.5634 3.93032 33.6985 4.4745 36.639 5.60895L36.639 5.60895Z" stroke="#D9D9D9" stroke-width="8" />
                        <path d="M36.639 5.60895C40.1726 6.97223 43.3334 9.15245 45.8629 11.9714C48.3924 14.7903 50.2189 18.1678 51.193 21.8279C52.1671 25.4879 52.2611 29.3265 51.4674 33.0299C50.6736 36.7332 49.0147 40.1962 46.6262 43.1355" stroke={colours.primary} stroke-width="8" stroke-linecap="round" />
                    </svg>
                    <div className="flex flex-col items-center gap-3">

                        <p className="font-black text-2xl">Loading Lesson</p>
                        <p className="font-bold">{saying}</p>
                    </div>
                </div>
            </div></div>
        </>
    )
}

export default CreatingLesson
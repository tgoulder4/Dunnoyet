import React from 'react'
import ProgressBar from "@ramonak/react-progress-bar";
import { getLevel } from './Levels';
import { changeColour, colours } from '@/lib/constants';
import EndLessonTimer from './EndLessonTimer';
function EndLesson({ subject, experiencePrior, experienceNow }: { subject: string, experiencePrior: number, experienceNow: number }) {
    //round experiencePrior down to the nearest 100 then add 100
    const experienceNeededForNextLevel = Math.ceil(experiencePrior / 100) * 100 + 100;
    const levelNext = getLevel(experienceNeededForNextLevel);
    const levelPrior = getLevel(experiencePrior);
    console.log("Completed amount: " + (experienceNeededForNextLevel - experienceNow) * 100 / experienceNeededForNextLevel, " experienceNeededForNextLevel: ", experienceNeededForNextLevel, " experienceNow: ", experienceNow, " levelNext: ", levelNext, " levelPrior: ", levelPrior)
    return (
        <div className='flex flex-col h-1/3 justify-between text-white'>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                    <svg width="92" height="92" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M68.9998 47.9165V38.3332C68.9998 36.2998 68.1921 34.3498 66.7543 32.912C65.3165 31.4742 63.3665 30.6665 61.3332 30.6665C59.2998 30.6665 57.3498 31.4742 55.912 32.912C54.4742 34.3498 53.6665 36.2998 53.6665 38.3332V43.6998" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M53.6668 42.1668V34.5002C53.6668 32.4668 52.8591 30.5168 51.4213 29.079C49.9835 27.6412 48.0335 26.8335 46.0002 26.8335C43.9668 26.8335 42.0168 27.6412 40.579 29.079C39.1412 30.5168 38.3335 32.4668 38.3335 34.5002V42.1668" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M38.3333 40.25V19.1667C38.3333 17.1333 37.5256 15.1833 36.0878 13.7455C34.65 12.3077 32.7 11.5 30.6667 11.5C28.6333 11.5 26.6833 12.3077 25.2455 13.7455C23.8077 15.1833 23 17.1333 23 19.1667V53.6667" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M26.8336 57.4998L20.0869 50.7532C18.6309 49.4291 16.7214 48.7157 14.7539 48.7606C12.7863 48.8055 10.9114 49.6054 9.51733 50.9945C8.12324 52.3837 7.31677 54.2557 7.26488 56.2231C7.21298 58.1905 7.91965 60.1025 9.23857 61.5632L23.0386 75.3632C28.7502 81.0365 35.2669 84.3332 46.0002 84.3332H53.6669C61.8002 84.3332 69.6004 81.1022 75.3515 75.3511C81.1026 69.6 84.3336 61.7998 84.3336 53.6665V26.8332C84.3336 24.7998 83.5258 22.8498 82.088 21.412C80.6503 19.9742 78.7002 19.1665 76.6669 19.1665C74.6336 19.1665 72.6835 19.9742 71.2457 21.412C69.808 22.8498 69.0002 24.7998 69.0002 26.8332V45.9998" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <h1 className='font-bold text-3xl text-white'>Lesson Complete - {subject}</h1>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className=''>You learnt 4 new concepts</h2>
                    <div className="flex flex-row gap-3">
                        <h2 className=''>Level {levelPrior}</h2>
                        <ProgressBar width='22vw' animateOnRender={true} transitionDuration='2s' transitionTimingFunction='ease-in-out' completed={(experienceNeededForNextLevel - experienceNow) * 100 / experienceNeededForNextLevel} baseBgColor={changeColour(colours.primaryObnoxious).darken(10).toString()} bgColor='white' />
                        <h2 className=''>Level {levelNext}</h2>
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-3">
                <h2 className='opacity-60 font-normal'>Taking you back home in</h2>
                <EndLessonTimer />
            </div>
        </div>
    )
}

export default EndLesson
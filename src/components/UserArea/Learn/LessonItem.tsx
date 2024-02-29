'use client'
import { colours, spacing } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function LessonItem({ loading, zeroLessons, subject, currentKnowledgeSummary, lessonID, imageURL, tutorialMode }: { loading?: boolean, zeroLessons?: boolean, tutorialMode?: boolean, subject?: string, currentKnowledgeSummary?: string, lessonID?: string, imageURL?: string }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Link aria-disabled={zeroLessons} className='flex flex-col-reverse sm:flex-row  gap-0 w-full sm:h-56' href={zeroLessons ? '/learn' : `/learn/lesson/${lessonID}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
            borderRadius: '10px',
            border: !loading ? zeroLessons ? '3px dashed rgba(0, 0, 0, 0.60)' : '1px solid rgba(0, 0, 0, 0.60)' : '',
            background: tutorialMode || zeroLessons ? '' : '#FFF',
        }}>{
                loading ? <div className="rounded-[10px] animate-pulse h-full flex-[3] w-full bg-gray-300"></div> :

                    <>            <article className='flex flex-col justify-between flex-[3] h-full' style={{ padding: spacing.padding.normalY, rowGap: spacing.gaps.groupedElement }}>
                        <div className="flex flex-col gap-2">
                            {zeroLessons && <>
                                <svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.69892 20.7736C5.22103 20.511 4.85066 20.1588 4.58781 19.717C4.32497 19.2753 4.19355 18.7798 4.19355 18.2307V11.3539L0.752688 9.45559C0.489845 9.31232 0.298686 9.13324 0.179211 8.91834C0.0597372 8.70344 0 8.46466 0 8.20201C0 7.93935 0.0597372 7.70057 0.179211 7.48567C0.298686 7.27077 0.489845 7.09169 0.752688 6.94842L12.8674 0.358166C13.0824 0.238777 13.3035 0.149236 13.5305 0.0895416C13.7575 0.0298472 13.9904 0 14.2294 0C14.4683 0 14.7013 0.0298472 14.9283 0.0895416C15.1553 0.149236 15.3763 0.238777 15.5914 0.358166L29.2473 7.80802C29.4863 7.92741 29.6714 8.10053 29.8029 8.32736C29.9343 8.5542 30 8.79895 30 9.0616V18.2307C30 18.6366 29.8626 18.9768 29.5878 19.2514C29.313 19.526 28.9725 19.6633 28.5663 19.6633C28.1601 19.6633 27.8196 19.526 27.5448 19.2514C27.27 18.9768 27.1326 18.6366 27.1326 18.2307V9.77794L24.2652 11.3539V18.2307C24.2652 18.7798 24.1338 19.2753 23.871 19.717C23.6081 20.1588 23.2378 20.511 22.7599 20.7736L15.5914 24.6418C15.3763 24.7612 15.1553 24.8508 14.9283 24.9105C14.7013 24.9702 14.4683 25 14.2294 25C13.9904 25 13.7575 24.9702 13.5305 24.9105C13.3035 24.8508 13.0824 24.7612 12.8674 24.6418L5.69892 20.7736ZM14.2294 13.5029L24.0502 8.20201L14.2294 2.90115L4.4086 8.20201L14.2294 13.5029ZM14.2294 22.1347L21.3979 18.2665V12.8582L15.6272 16.0458C15.4122 16.1652 15.1852 16.2548 14.9462 16.3145C14.7073 16.3742 14.4683 16.404 14.2294 16.404C13.9904 16.404 13.7515 16.3742 13.5125 16.3145C13.2736 16.2548 13.0466 16.1652 12.8315 16.0458L7.06093 12.8582V18.2665L14.2294 22.1347Z" fill="black" />
                                </svg>

                                <h2 style={{ fontWeight: 800 }}>No Lessons Yet</h2>
                            </>}
                            <div className="flex gap-2 items-center">
                                <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.75 21.3875C2 21.3875 1.35417 21.1334 0.8125 20.625C0.270833 20.1167 0 19.4875 0 18.7375V4.78755C0 4.15422 0.195833 3.58755 0.5875 3.08755C0.979167 2.58755 1.49167 2.27088 2.125 2.13755L9.625 0.662549C10.2417 0.529215 10.7917 0.662549 11.275 1.06255C11.7583 1.46255 12 1.97922 12 2.61255V14.5375C12 15.0209 11.85 15.45 11.55 15.825C11.25 16.2 10.8667 16.4292 10.4 16.5125L2.525 18.0875C2.375 18.1209 2.25 18.2 2.15 18.325C2.05 18.45 2 18.5875 2 18.7375C2 18.9209 2.075 19.075 2.225 19.2C2.375 19.325 2.55 19.3875 2.75 19.3875H14V4.38755C14 4.10422 14.0958 3.86672 14.2875 3.67505C14.4792 3.48338 14.7167 3.38755 15 3.38755C15.2833 3.38755 15.5208 3.48338 15.7125 3.67505C15.9042 3.86672 16 4.10422 16 4.38755V19.3875C16 19.9375 15.8042 20.4084 15.4125 20.8C15.0208 21.1917 14.55 21.3875 14 21.3875H2.75ZM5 15.5625L10 14.5875V2.63755L5 3.61255V15.5625ZM3 15.9625V4.01255L2.625 4.08755C2.44167 4.12088 2.29167 4.20005 2.175 4.32505C2.05833 4.45005 2 4.60422 2 4.78755V16.2125C2.08333 16.1792 2.17083 16.15 2.2625 16.125C2.35417 16.1 2.44167 16.0792 2.525 16.0625L3 15.9625Z" fill="black" />
                                </svg>

                                <h2 className='font-[800]'>
                                    {!zeroLessons ? subject : "Start your first lesson with your personalised tutor."}</h2>
                            </div>
                            <h3 className='lg:max-w-full line-clamp-3 text-ellipsis'>{currentKnowledgeSummary}</h3>
                        </div>
                        {!tutorialMode &&
                            <div className="flex gap-2 items-center">

                                <h2 style={{ color: colours.link, textDecoration: hovered ? 'underline' : 'none', fontWeight: hovered ? 700 : 500 }}>{zeroLessons ? "" : "Continue Lesson"
                                } </h2>
                                {
                                    !zeroLessons &&

                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.95 13H0.422V11.308L10.142 11.398L0.854 1.534L2.276 0.219999L11.312 10.264L11.204 0.471999H12.95V13Z" fill="#19445C" />
                                    </svg>
                                }

                            </div>
                        }
                    </article>
                        {
                            !zeroLessons && imageURL &&
                            <div className="hidden xl:block relative w-full flex-[2]">
                                <Image src={imageURL} alt="Lesson Image" fill sizes='100%' />
                            </div>
                        }
                    </>
            }

        </Link>
        // <pre>{
        //     JSON.stringify({
        //         subject,
        //         currentKnowledgeSummary,
        //         lessonID,
        //         imageURL
        //     }, null, 2)}
        // </pre>
    )
}

export default LessonItem
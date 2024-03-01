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
                            <div className="flex gap-2 items-center">
                                <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.75 21.3875C2 21.3875 1.35417 21.1334 0.8125 20.625C0.270833 20.1167 0 19.4875 0 18.7375V4.78755C0 4.15422 0.195833 3.58755 0.5875 3.08755C0.979167 2.58755 1.49167 2.27088 2.125 2.13755L9.625 0.662549C10.2417 0.529215 10.7917 0.662549 11.275 1.06255C11.7583 1.46255 12 1.97922 12 2.61255V14.5375C12 15.0209 11.85 15.45 11.55 15.825C11.25 16.2 10.8667 16.4292 10.4 16.5125L2.525 18.0875C2.375 18.1209 2.25 18.2 2.15 18.325C2.05 18.45 2 18.5875 2 18.7375C2 18.9209 2.075 19.075 2.225 19.2C2.375 19.325 2.55 19.3875 2.75 19.3875H14V4.38755C14 4.10422 14.0958 3.86672 14.2875 3.67505C14.4792 3.48338 14.7167 3.38755 15 3.38755C15.2833 3.38755 15.5208 3.48338 15.7125 3.67505C15.9042 3.86672 16 4.10422 16 4.38755V19.3875C16 19.9375 15.8042 20.4084 15.4125 20.8C15.0208 21.1917 14.55 21.3875 14 21.3875H2.75ZM5 15.5625L10 14.5875V2.63755L5 3.61255V15.5625ZM3 15.9625V4.01255L2.625 4.08755C2.44167 4.12088 2.29167 4.20005 2.175 4.32505C2.05833 4.45005 2 4.60422 2 4.78755V16.2125C2.08333 16.1792 2.17083 16.15 2.2625 16.125C2.35417 16.1 2.44167 16.0792 2.525 16.0625L3 15.9625Z" fill="black" />
                                </svg>

                                <h2 className='font-[800]'>
                                    {!zeroLessons ? subject : "No lessons yet"}</h2>
                            </div>
                            <h3 className='lg:max-w-full line-clamp-3 text-ellipsis'>{!zeroLessons ? currentKnowledgeSummary : "Start your first lesson with your personalised tutor."}</h3>
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
'use client'
import { colours, spacing } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function LessonItem({ loading, subject, currentKnowledgeSummary, lessonID, imageURL }: { loading?: boolean, subject?: string, currentKnowledgeSummary?: string, lessonID?: string, imageURL?: string }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Link className='flex flex-col-reverse sm:flex-row  gap-0 w-full sm:h-56' href={`/learn/${lessonID}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
            borderRadius: '10px',
            border: !loading ? '1px solid rgba(0, 0, 0, 0.60)' : '',
            background: '#FFF',
        }}>{
                loading ? <div className="rounded-[10px] animate-pulse h-full flex-[3] w-full bg-gray-300"></div> :
                    <>            <article className='flex flex-col justify-between flex-[3] h-full' style={{ padding: spacing.padding.normalY, rowGap: spacing.gaps.groupedElement }}>
                        <div className="flex flex-col gap-2">

                            <div className="flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none">
                                    <path d="M4.55914 16.6189C4.17682 16.4088 3.88053 16.127 3.67025 15.7736C3.45998 15.4202 3.35484 15.0239 3.35484 14.5845V9.08309L0.602151 7.56447C0.391876 7.44986 0.238949 7.30659 0.143369 7.13467C0.0477897 6.96275 0 6.77173 0 6.5616C0 6.35148 0.0477897 6.16046 0.143369 5.98854C0.238949 5.81662 0.391876 5.67335 0.602151 5.55874L10.2939 0.286533C10.466 0.191022 10.6428 0.119389 10.8244 0.0716332C11.006 0.0238777 11.1924 0 11.3835 0C11.5747 0 11.7611 0.0238777 11.9427 0.0716332C12.1243 0.119389 12.3011 0.191022 12.4731 0.286533L23.3979 6.24642C23.589 6.34193 23.7372 6.48042 23.8423 6.66189C23.9474 6.84336 24 7.03916 24 7.24928V14.5845C24 14.9093 23.8901 15.1815 23.6702 15.4011C23.4504 15.6208 23.178 15.7307 22.853 15.7307C22.5281 15.7307 22.2557 15.6208 22.0358 15.4011C21.816 15.1815 21.7061 14.9093 21.7061 14.5845V7.82235L19.4122 9.08309V14.5845C19.4122 15.0239 19.307 15.4202 19.0968 15.7736C18.8865 16.127 18.5902 16.4088 18.2079 16.6189L12.4731 19.7135C12.3011 19.809 12.1243 19.8806 11.9427 19.9284C11.7611 19.9761 11.5747 20 11.3835 20C11.1924 20 11.006 19.9761 10.8244 19.9284C10.6428 19.8806 10.466 19.809 10.2939 19.7135L4.55914 16.6189ZM11.3835 10.8023L19.2401 6.5616L11.3835 2.32092L3.52688 6.5616L11.3835 10.8023ZM11.3835 17.7077L17.1183 14.6132V10.2865L12.5018 12.8367C12.3297 12.9322 12.1481 13.0038 11.957 13.0516C11.7658 13.0993 11.5747 13.1232 11.3835 13.1232C11.1924 13.1232 11.0012 13.0993 10.81 13.0516C10.6189 13.0038 10.4373 12.9322 10.2652 12.8367L5.64875 10.2865V14.6132L11.3835 17.7077Z" fill="black" />
                                </svg>
                                <h2 style={{ fontWeight: 800 }}>{subject}</h2>
                            </div>
                            <h3 className='lg:max-w-full line-clamp-3 text-ellipsis'>{currentKnowledgeSummary}</h3>
                        </div>
                        <div className="flex gap-2 items-center">
                            <h2 style={{ color: colours.link, textDecoration: hovered ? 'underline' : 'none', fontWeight: hovered ? 700 : 500 }}>Continue Lesson </h2>
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.95 13H0.422V11.308L10.142 11.398L0.854 1.534L2.276 0.219999L11.312 10.264L11.204 0.471999H12.95V13Z" fill="#19445C" />
                            </svg>

                        </div>
                    </article>
                        <div className="hidden xl:block relative w-full flex-[2]">
                            <Image src={imageURL || ""} alt="Lesson Image" fill sizes='100%' />
                        </div></>
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
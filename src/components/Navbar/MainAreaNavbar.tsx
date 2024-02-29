'use client'
import React from 'react'
import { DunnoyetLogo, changeColour, colours, spacing } from '@/lib/constants'
import NewButton from '@/components/ui/NewButton'
import UserAuthButton from '@/components/Navbar/UserAuthButton'
import { getURL } from 'next/dist/shared/lib/utils'
import LessonTimer from './LessonTimer'

function MainAreaNavbar({ style, }: { style: 'normal' | 'lesson' }) {
    const theme = {
        backgroundColour: style == 'normal' ? colours.primary : '#000',
    }
    return (
        <nav style={{
            // borderTopWidth: 1, borderTopColor: changeColour(colours.primary).darken(8).toString(), 
            backgroundColor: theme.backgroundColour, paddingLeft: spacing.gaps.separateElement, paddingRight: spacing.gaps.separateElement
        }} className="flex flex-row justify-between items-center h-[70px] sticky top-0 z-50">
            <div className="leftSide flex items-center h-full" style={{ columnGap: spacing.gaps.groupedElement }}>
                <NewButton buttonVariant="ghost" actionOrLink="/"> {DunnoyetLogo({ colour: 'white', withText: false })}</NewButton>
                <div className="hidden md:block flex-1 w-[1px] h-full" style={{ backgroundColor: style == 'normal' ? changeColour(theme.backgroundColour).darken(8).toString() : changeColour(theme.backgroundColour).lighten(25).toString() }}></div>
                <div className="flex" style={{ paddingLeft: spacing.padding.normalX, columnGap: spacing.gaps.separateElement }}>
                    {
                        style == 'lesson' ? <NewButton noAnimation className='text-white' buttonVariant="ghost" actionOrLink={getURL()}>In Lesson:
                            <LessonTimer />
                        </NewButton> :
                            <>
                                <NewButton className="hidden md:flex transition-none hover:scale-100" textColour="white" style={{ padding: 0 }} buttonVariant="ghost" actionOrLink="/learn">Home</NewButton>
                                <NewButton className="hidden md:flex transition-none hover:scale-100" textColour="white" style={{ padding: 0 }} buttonVariant="ghost" actionOrLink="/mind">Mind</NewButton></>
                    }
                </div>
            </div>
            <div className="rightSide py-[14px] flex h-full" style={{ columnGap: spacing.gaps.separateElement }}>
                {/* <div style={{ display: 'none' }} className='hidden md:block md:flex md:hidden block'></div> */}
                {/* <NewButton className='hidden md:block' style={{ padding: 0 }} buttonVariant="ghost" actionOrLink=""><svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.1944 20.7222V20.9722H14.4444H24.5556C24.9019 20.9722 25.1803 21.0866 25.4079 21.3143C25.6356 21.5419 25.75 21.8204 25.75 22.1667C25.75 22.513 25.6356 22.7914 25.4079 23.0191C25.1803 23.2467 24.9019 23.3611 24.5556 23.3611H14.4444H14.1944V23.6111V25.0556C14.1944 25.4019 14.08 25.6803 13.8524 25.9079C13.6247 26.1356 13.3463 26.25 13 26.25C12.6537 26.25 12.3753 26.1356 12.1476 25.9079C11.92 25.6803 11.8056 25.4019 11.8056 25.0556V19.2778C11.8056 18.9315 11.92 18.653 12.1476 18.4254C12.3753 18.1977 12.6537 18.0833 13 18.0833C13.3463 18.0833 13.6247 18.1977 13.8524 18.4254C14.08 18.653 14.1944 18.9315 14.1944 19.2778V20.7222ZM6.02778 14.9444V14.6944H5.77778H1.44444C1.09814 14.6944 0.819708 14.58 0.592054 14.3524C0.364401 14.1247 0.25 13.8463 0.25 13.5C0.25 13.1537 0.364401 12.8753 0.592054 12.6476C0.819708 12.42 1.09814 12.3056 1.44444 12.3056H5.77778H6.02778V12.0556V10.6111C6.02778 10.2648 6.14218 9.98638 6.36983 9.75872C6.59749 9.53107 6.87592 9.41667 7.22222 9.41667C7.56852 9.41667 7.84696 9.53107 8.07461 9.75872C8.30227 9.98638 8.41667 10.2648 8.41667 10.6111V16.3889C8.41667 16.7352 8.30227 17.0136 8.07461 17.2413C7.84696 17.4689 7.56852 17.5833 7.22222 17.5833C6.87592 17.5833 6.59749 17.4689 6.36983 17.2413C6.14218 17.0136 6.02778 16.7352 6.02778 16.3889V14.9444ZM19.9722 3.38889V3.63889H20.2222H24.5556C24.9019 3.63889 25.1803 3.75329 25.4079 3.98094C25.6356 4.2086 25.75 4.48703 25.75 4.83333C25.75 5.17963 25.6356 5.45807 25.4079 5.68572C25.1803 5.91338 24.9019 6.02778 24.5556 6.02778H20.2222H19.9722V6.27778V7.72222C19.9722 8.06852 19.8578 8.34696 19.6302 8.57461C19.4025 8.80227 19.1241 8.91667 18.7778 8.91667C18.4315 8.91667 18.153 8.80227 17.9254 8.57461C17.6977 8.34696 17.5833 8.06852 17.5833 7.72222V1.94444C17.5833 1.59814 17.6977 1.31971 17.9254 1.09205C18.153 0.864401 18.4315 0.75 18.7778 0.75C19.1241 0.75 19.4025 0.864401 19.6302 1.09205C19.8578 1.31971 19.9722 1.59814 19.9722 1.94444V3.38889ZM1.44444 23.3611C1.09814 23.3611 0.819708 23.2467 0.592054 23.0191C0.364401 22.7914 0.25 22.513 0.25 22.1667C0.25 21.8204 0.364401 21.5419 0.592054 21.3143C0.819708 21.0866 1.09814 20.9722 1.44444 20.9722H7.22222C7.56852 20.9722 7.84696 21.0866 8.07461 21.3143C8.30227 21.5419 8.41667 21.8204 8.41667 22.1667C8.41667 22.513 8.30227 22.7914 8.07461 23.0191C7.84696 23.2467 7.56852 23.3611 7.22222 23.3611H1.44444ZM13 14.6944C12.6537 14.6944 12.3753 14.58 12.1476 14.3524C11.92 14.1247 11.8056 13.8463 11.8056 13.5C11.8056 13.1537 11.92 12.8753 12.1476 12.6476C12.3753 12.42 12.6537 12.3056 13 12.3056H24.5556C24.9019 12.3056 25.1803 12.42 25.4079 12.6476C25.6356 12.8753 25.75 13.1537 25.75 13.5C25.75 13.8463 25.6356 14.1247 25.4079 14.3524C25.1803 14.58 24.9019 14.6944 24.5556 14.6944H13ZM1.44444 6.02778C1.09814 6.02778 0.819708 5.91338 0.592054 5.68572C0.364401 5.45807 0.25 5.17963 0.25 4.83333C0.25 4.48703 0.364401 4.2086 0.592054 3.98094C0.819708 3.75329 1.09814 3.63889 1.44444 3.63889H13C13.3463 3.63889 13.6247 3.75329 13.8524 3.98094C14.08 4.2086 14.1944 4.48703 14.1944 4.83333C14.1944 5.17963 14.08 5.45807 13.8524 5.68572C13.6247 5.91338 13.3463 6.02778 13 6.02778H1.44444Z" fill="white" stroke="#FFF" strokeWidth="0.5" />
          </svg>
          </NewButton> */}
                {
                    style == 'normal' ? <>
                        <NewButton className="hidden md:flex flex-row items-center" style={{ rowGap: spacing.gaps.groupedElement }} buttonVariant="white" actionOrLink="/learn/lesson/new"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.94407 6.92174L6.83669 3.86087V0H9.16331V3.86087L9.02013 6.92174L11.6689 6.74783H16V9.00869H11.6689L9.02013 8.90435L9.16331 11.8957V16H6.83669V11.8957L6.94407 8.90435L3.86577 9.00869H0V6.74783H3.86577L6.94407 6.92174Z" fill="#323232" />
                        </svg> <h2>New Question</h2>
                        </NewButton>
                        <NewButton buttonVariant='ghost' className='relative block md:hidden'>
                            <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.39222 21.7434C1.90147 21.7434 1.48314 21.57 1.13722 21.2231C0.791306 20.8763 0.618347 20.4515 0.618347 19.9489C0.618347 19.4661 0.791306 19.0528 1.13722 18.7092C1.48314 18.3657 1.90147 18.1939 2.39222 18.1939H29.6217C30.1032 18.1939 30.5195 18.3673 30.8707 18.7141C31.2218 19.061 31.3974 19.4758 31.3974 19.9587C31.3974 20.4613 31.2218 20.8844 30.8707 21.228C30.5195 21.5716 30.1032 21.7434 29.6217 21.7434H2.39222ZM2.39222 12.753C1.90147 12.753 1.48314 12.5796 1.13722 12.2327C0.791306 11.8859 0.618347 11.4664 0.618347 10.9743C0.618347 10.4914 0.791306 10.0782 1.13722 9.73457C1.48314 9.39099 1.90147 9.2192 2.39222 9.2192H29.6217C30.1032 9.2192 30.5195 9.39261 30.8707 9.73945C31.2218 10.0863 31.3974 10.5012 31.3974 10.984C31.3974 11.4761 31.2218 11.894 30.8707 12.2376C30.5195 12.5812 30.1032 12.753 29.6217 12.753H2.39222ZM2.39222 3.77836C1.90147 3.77836 1.48314 3.60493 1.13722 3.25807C0.791306 2.91121 0.618347 2.48649 0.618347 1.9839C0.618347 1.50104 0.791306 1.08781 1.13722 0.744197C1.48314 0.400613 1.90147 0.228821 2.39222 0.228821H29.6217C30.1032 0.228821 30.5195 0.402238 30.8707 0.749072C31.2218 1.09593 31.3974 1.51079 31.3974 1.99365C31.3974 2.49624 31.2218 2.91933 30.8707 3.26294C30.5195 3.60656 30.1032 3.77836 29.6217 3.77836H2.39222Z" fill="white" />
                            </svg>
                        </NewButton>

                        <UserAuthButton /></> : <>
                        <NewButton className="hidden md:flex flex-row items-center" style={{ rowGap: spacing.gaps.groupedElement }} buttonVariant="white" actionOrLink={getURL() + "/end"}>
                            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 18.5C1.45 18.5 0.979167 18.3042 0.5875 17.9125C0.195833 17.5208 0 17.05 0 16.5V13.5C0 13.2167 0.0958333 12.9792 0.2875 12.7875C0.479167 12.5958 0.716667 12.5 1 12.5C1.28333 12.5 1.52083 12.5958 1.7125 12.7875C1.90417 12.9792 2 13.2167 2 13.5V16.5H16V2.5H2V5.5C2 5.78333 1.90417 6.02083 1.7125 6.2125C1.52083 6.40417 1.28333 6.5 1 6.5C0.716667 6.5 0.479167 6.40417 0.2875 6.2125C0.0958333 6.02083 0 5.78333 0 5.5V2.5C0 1.95 0.195833 1.47917 0.5875 1.0875C0.979167 0.695833 1.45 0.5 2 0.5H16C16.55 0.5 17.0208 0.695833 17.4125 1.0875C17.8042 1.47917 18 1.95 18 2.5V16.5C18 17.05 17.8042 17.5208 17.4125 17.9125C17.0208 18.3042 16.55 18.5 16 18.5H2ZM8.65 10.5H1C0.716667 10.5 0.479167 10.4042 0.2875 10.2125C0.0958333 10.0208 0 9.78333 0 9.5C0 9.21667 0.0958333 8.97917 0.2875 8.7875C0.479167 8.59583 0.716667 8.5 1 8.5H8.65L6.8 6.65C6.6 6.45 6.50417 6.21667 6.5125 5.95C6.52083 5.68333 6.61667 5.45 6.8 5.25C7 5.05 7.2375 4.94583 7.5125 4.9375C7.7875 4.92917 8.025 5.025 8.225 5.225L11.8 8.8C11.9 8.9 11.9708 9.00833 12.0125 9.125C12.0542 9.24167 12.075 9.36667 12.075 9.5C12.075 9.63333 12.0542 9.75833 12.0125 9.875C11.9708 9.99167 11.9 10.1 11.8 10.2L8.225 13.775C8.025 13.975 7.7875 14.0708 7.5125 14.0625C7.2375 14.0542 7 13.95 6.8 13.75C6.61667 13.55 6.52083 13.3167 6.5125 13.05C6.50417 12.7833 6.6 12.55 6.8 12.35L8.65 10.5Z" fill="black" />
                            </svg>

                        </NewButton>
                    </>
                }
            </div>
        </nav>
    )
}

export default MainAreaNavbar
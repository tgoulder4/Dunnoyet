import { merriweather } from '@/app/fonts'
import ReportErrorForm from '@/components/auth/error/reportErrorForm'
import { colours, responsiveFont, sizing, spacing } from '@/lib/constants'
import React from 'react'
import { Metadata } from 'next'
export const metadata: Metadata = {
    title: "dunnoyet - Error",
    description: "Log into your account."
}
function ErrorPage() {
    return (
        <div className='flex flex-col items-start w-full h-full' style={{
            width: 'clamp(320px, 80vw, 100%)', rowGap: spacing.gaps.separateElement, paddingTop: spacing.gaps.separateElement
        }}>
            <h1 className='text-5xl font-bold text-gray-500'>{`:(`}</h1>
            <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>

                <h1 style={{ fontSize: responsiveFont(sizing.largestFontSize), fontFamily: merriweather.style.fontFamily }} className=''>There was an error</h1>
                <p>Sorry, it looks like something went wrong on our end. If this issue persists, please report it below and we&apos;ll address it ASAP.</p>
                <ReportErrorForm />
            </div>
        </div>
    )
}

export default ErrorPage
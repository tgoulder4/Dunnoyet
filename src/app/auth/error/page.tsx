import { merriweather } from '@/app/fonts'
import Form from '@/components/Auth/Error/Form'
import NewButton from '@/components/ui/NewButton'
import { colours, sizing, spacing } from '@/lib/constants'
import React from 'react'

function ErrorPage() {
    return (
        <div className='mx-auto flex flex-col' style={{
            width: 'clamp(320px, 80vw, 600px)', rowGap: spacing.gaps.separateElement, paddingTop: spacing.gaps.largest
        }}>
            <h1 className='text-5xl font-bold text-gray-500'>{`:(`}</h1>
            <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>

                <h1 style={{ fontSize: sizing.largestFontSize, fontFamily: merriweather.style.fontFamily }} className=''>There was an error</h1>
                <p>Sorry, it looks like something went wrong on our end. If this issue persists, please report it below and we'll address it ASAP.</p>
                <Form />
            </div>
        </div>
    )
}

export default ErrorPage
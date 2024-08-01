'use client'
import React from 'react'
import NewButton from '@/components/ui/NewButton'
import { colours, spacing } from '@/lib/constants'

function ReportErrorForm() {
    return (
        <form className='flex flex-col' style={{ rowGap: spacing.gaps.groupedElement }}>
            <label style={{ color: colours.textLegend }} htmlFor="errorReport">Report Issue</label>
            <textarea name="errorReport" id="errorReport" className='p-2'></textarea>
            <NewButton buttonVariant='black' actionOrLink={() => {
                alert('Issue reported')
            }}>Submit and Go to homepage</NewButton>
        </form>
    )
}

export default ReportErrorForm
import { Input } from '@/components/ui/input'
import React, { ForwardedRef } from 'react'
import { colours, sizing, spacing } from '@/lib/constants'

const InputWithLegend = React.forwardRef(({
    idAndName, type, defaultValue, placeholder, children, onFocus
}: {
    idAndName: string,
    type: string,
    defaultValue?: string,
    placeholder?: string,
    children?: React.ReactNode,
    onFocus?: () => void
}, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <div className="flex flex-col w-full" style={{ rowGap: spacing.gaps.groupedElement }}>
            <label style={{ color: colours.textLegend }} className='font-bold' htmlFor="usernameField">{placeholder}</label>
            <Input onFocus={onFocus} required id={idAndName} name={idAndName} ref={ref} defaultValue={defaultValue} className='py-[20px] w-full' type={type} style={{ fontSize: sizing.globalFontSize, paddingLeft: spacing.gaps.separateElement, paddingRight: spacing.gaps.separateElement }} placeholder={placeholder} />
            {children}
        </div>
    )
})

export default InputWithLegend
import { Input } from '@/components/ui/input'
import React, { ForwardedRef } from 'react'
import { colours, sizing, spacing } from '@/lib/constants'

interface InputWithLegendProps extends React.HTMLProps<HTMLInputElement> {
    idAndName: string;
    type: string;
    defaultValue?: string;
    placeholder?: string;
    children?: React.ReactNode;
}
const InputWithLegend = React.forwardRef<HTMLInputElement, InputWithLegendProps>(
    ({ idAndName, type, defaultValue, placeholder, children, ...rest }, ref: ForwardedRef<HTMLInputElement>) => (
        <div className="flex flex-col w-full" style={{ rowGap: spacing.gaps.groupedElement }}>
            <label style={{ color: colours.textLegend }} className='font-bold' htmlFor={idAndName}>{placeholder}</label>
            <Input
                required
                id={idAndName}
                name={idAndName}
                ref={ref}
                defaultValue={defaultValue}
                className='py-[20px] w-full'
                type={type}
                style={{ fontSize: sizing.globalFontSize, paddingLeft: spacing.gaps.separateElement, paddingRight: spacing.gaps.separateElement }}
                placeholder={placeholder}
                {...rest}
            />
            {children}
        </div>
    )
);

export default InputWithLegend
'use client'
import React, { useRef, useEffect } from 'react'
import { responsiveFont, sizing, spacing } from '@/lib/constants'
import { merriweather } from '@/app/fonts'
import { Input } from '../../../ui/input'
import NewButton from '../../../ui/NewButton'
import { colours } from '@/lib/constants'
import { useFormState, useFormStatus } from 'react-dom'
import { authenticate, createUser } from '../../../../actions'
import { ArrowRightIcon, Loader2 } from 'lucide-react'
import InputWithLegend from './InputWithFieldset'

function SignUpForm() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [errorMessage, dispatch] = useFormState(createUser, undefined);
    const { pending } = useFormStatus();
    useEffect(() => {
        usernameRef.current?.focus()
    }, [])
    return (
        <form
            action={dispatch}
            className='flex-[2] flex justify-end' style={{ paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, paddingTop: spacing.gaps.largest, marginBottom: spacing.gaps.largest }}>
            <div className='flex flex-col' style={{ rowGap: spacing.gaps.separateElement, width: 'clamp(43px,100%,680px)' }}>
                <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largestFontSize) }}>Create an account</h1>
                <fieldset name='fs' className='flex flex-col' style={{ rowGap: spacing.gaps.separateElement }}>
                    <InputWithLegend ref={usernameRef} idAndName="username" type="text" placeholder="Username" defaultValue='tgoulder4' />
                    <InputWithLegend ref={passwordRef} idAndName="password" type="password" placeholder="Password" defaultValue='testPassword'>
                        {
                            errorMessage &&
                            // passwordRef.current?.focus()
                            <div className='grid place-items-center w-full font-bold py-[14px] rounded-[10px]' style={{ backgroundColor: 'rgb(255,27,27,0.38)' }}>
                                {errorMessage}
                            </div>
                        }
                    </InputWithLegend>

                    <InputWithLegend idAndName="confirmPassword" type="password" placeholder="Confirm Password" />
                    <InputWithLegend idAndName="email" type="email" placeholder="Email" />

                    <NewButton type='submit' aria-disabled={pending} className='w-full' style={{ paddingLeft: spacing.gaps.separateElement, paddingRight: spacing.gaps.separateElement, paddingTop: 14, paddingBottom: 14 }} buttonVariant="black" >
                        Sign In
                        {
                            pending ? <Loader2 className='animate-spin' color='white' size={24} /> : <ArrowRightIcon color='white' />
                        }
                    </NewButton>
                </fieldset>
            </div>
        </form>
    )
}

export default SignUpForm
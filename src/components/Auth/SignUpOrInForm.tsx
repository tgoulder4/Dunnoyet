'use client'
import React, { useRef, useEffect } from 'react'
import { sizing, spacing } from '@/lib/constants'
import { merriweather } from '@/app/fonts'
import { Input } from '../ui/input'
import NewButton from '../ui/NewButton'
import { colours } from '@/lib/constants'
import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from '../../actions'
import { ArrowRightIcon, Loader2 } from 'lucide-react'

function SignUpOrInForm({ type }: { type: "signin" | "signup" }) {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);
    const { pending } = useFormStatus();
    useEffect(() => {
        usernameRef.current?.focus()
    }, [])
    return (
        <form
            action={dispatch}
            className='flex-2 grow' style={{ padding: 2 * spacing.gaps.largest, paddingTop: spacing.gaps.largest }}>
            <div className='flex flex-col' style={{ rowGap: spacing.gaps.separateElement }}>
                <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: sizing.largestFontSize }}>{type == "signin" ? "Sign into your account" : "Create an account"}</h1>
                <fieldset name='fs' className='flex flex-col' style={{ rowGap: spacing.gaps.separateElement }}>
                    <div className="flex flex-col w-full" style={{ rowGap: spacing.gaps.groupedElement }}>
                        <label style={{ color: colours.textLegend }} className='font-bold' htmlFor="usernameField">Username</label>
                        <Input required id="username" name="username" ref={usernameRef} defaultValue="tgoulder4" className='py-[20px] w-full' type="text" style={{ fontSize: sizing.globalFontSize, paddingLeft: spacing.gaps.separateElement, paddingRight: spacing.gaps.separateElement }} placeholder="Username" />
                    </div>
                    <div className="flex flex-col w-full" style={{ rowGap: spacing.gaps.groupedElement }}>
                        <label style={{ color: colours.textLegend }} className='font-bold' htmlFor="passwordField">Password</label>
                        <Input required id="password" name="password" type="password" defaultValue="testPassword" ref={passwordRef} className='py-[20px] w-full' style={{ fontSize: sizing.globalFontSize, paddingLeft: spacing.gaps.separateElement, paddingRight: spacing.gaps.separateElement }} placeholder="Password" />
                        {
                            errorMessage &&
                            // passwordRef.current?.focus()
                            <div className='grid place-items-center w-full font-bold py-[14px] rounded-[10px]' style={{ backgroundColor: 'rgb(255,27,27,0.38)' }}>
                                {errorMessage}
                            </div>
                        }
                    </div>
                    {
                        type === 'signup' ? (
                            <div className="flex flex-col w-full" style={{ rowGap: spacing.gaps.groupedElement }}>
                                <label style={{ color: colours.textLegend }} className='font-bold' htmlFor="confirmPasswordField">Confirm Password</label>
                                <Input className='py-[20px] w-full' type="text" id="confirmPasswordField" style={{ fontSize: sizing.globalFontSize, paddingLeft: spacing.gaps.separateElement, paddingRight: spacing.gaps.separateElement }} placeholder="Confirm Password" />
                            </div>
                        ) : null
                    }
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

export default SignUpOrInForm
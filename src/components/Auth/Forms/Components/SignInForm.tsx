'use client'
import React, { useRef, useEffect, useState } from 'react'
import { changeColour, responsiveFont, sizing, spacing } from '@/lib/constants'
import { merriweather } from '@/app/fonts'
import { Input } from '../../../ui/input'
import NewButton from '../../../ui/NewButton'
import { colours } from '@/lib/constants'
import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from '../../../../actions'
import { ArrowRightIcon, Loader2 } from 'lucide-react'
import InputWithLegend from './InputWithFieldset'
import { AuthError } from "next-auth";
import Link from 'next/link'
import { TinyColor } from '@ctrl/tinycolor'

function SignInForm() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    // const [errorMessage, dispatch] = useFormState(authenticate, undefined);
    //CORRECTION:
    let [responseMsg, dispatch] = useFormState(authenticate, undefined)
    const [showMessage, setShowMessage] = useState(true);
    console.log("showmessage", showMessage, "responseMsg", responseMsg)
    const { pending } = useFormStatus();
    useEffect(() => {
        usernameRef.current?.focus()
    }, [])
    return (
        <form
            action={dispatch}
            className='flex-[2] flex justify-end' style={{ paddingLeft: sizing.variableWholePagePadding, paddingRight: sizing.variableWholePagePadding, paddingTop: spacing.gaps.largest }}>
            <div className='flex flex-col' style={{ rowGap: spacing.gaps.separateElement, width: 'clamp(43px,100%,680px)' }}>
                <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: responsiveFont(sizing.largestFontSize) }}>Sign into your account</h1>
                <h2 className='font-bold'>Don't have an account yet? <Link href="/auth/register" style={{ color: changeColour(colours.primary).darken(8).toString() }}>Sign up</Link></h2>
                <fieldset name='fs' className='flex flex-col' style={{ rowGap: spacing.gaps.separateElement }}>
                    <InputWithLegend onFocus={() => { responseMsg = undefined; setShowMessage(false) }} ref={usernameRef} idAndName="username" type="text" placeholder="Username" defaultValue='tgoulder4' />
                    <InputWithLegend onFocus={() => { responseMsg = undefined; setShowMessage(false) }} ref={passwordRef} idAndName="password" type="password" placeholder="Password" defaultValue='testPassword'>
                        {
                            responseMsg ? responseMsg !== "Signing you in..." ?
                                // passwordRef.current?.focus()
                                showMessage && <div className='grid place-items-center w-full font-bold py-[14px] rounded-[10px]' style={{ backgroundColor: 'rgb(255,27,27,0.38)' }}>
                                    {responseMsg}
                                </div> :
                                showMessage && <div className='grid place-items-center w-full font-bold py-[14px] rounded-[10px]' style={{ backgroundColor: 'rgb(66, 186, 150)' }}>
                                    {responseMsg}
                                    <Loader2 className="animate-spin" color="#000000" />
                                </div> : <></>
                        }
                    </InputWithLegend>
                    <NewButton type='submit'
                        onMouseUp={() => { setShowMessage(true) }}
                        aria-disabled={pending} className='w-full' style={{ paddingLeft: spacing.gaps.separateElement, paddingRight: spacing.gaps.separateElement, paddingTop: 14, paddingBottom: 14 }} buttonVariant="black" >
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

export default SignInForm
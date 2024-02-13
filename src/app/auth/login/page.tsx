import SignUpOrIn from '@/components/auth/SignUpOrIn'
import React from 'react'
import { Metadata } from 'next'
export const metadata: Metadata = {
    title: "dunnoyet - Login",
    description: "Log into your account."
}
function LoginPage() {
    //if they're already logged in, redirect them to the user area.
    return (
        <SignUpOrIn type='signin' />
    )
}

export default LoginPage
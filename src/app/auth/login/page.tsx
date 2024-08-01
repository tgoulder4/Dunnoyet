import React from 'react'
import { Metadata } from 'next'
import SignInForm from '@/components/auth/Forms/Components/SignInForm'
import SignUpOrIn from '@/components/auth/Forms/signUpOrIn'
export const metadata: Metadata = {
    title: "dunnoyet - Login",
    description: "Log into your account."
}
function LoginPage() {
    //if they're already logged in, redirect them to the user area.
    return (
        <SignUpOrIn type="signin" />
    )
}

export default LoginPage
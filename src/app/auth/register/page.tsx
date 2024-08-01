import SignUpOrIn from '@/components/auth/Forms/signUpOrIn'
import React from 'react'
import { Metadata } from 'next'
export const metadata: Metadata = {
    title: "dunnoyet - Register",
    description: "Create your account."
}
function RegisterPage() {
    return (
        <SignUpOrIn type='signup' />
    )
}

export default RegisterPage
'use client'
import React from 'react'
import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { colours } from '@/lib/constants'
type Props = {
    submitting: boolean
}

function SubmitButton({ submitting }: Props) {
    return (
        <Button type='submit' disabled={submitting} className='absolute h-10 bottom-[0.5rem] right-2 p-2 grid place-items-center rounded-xl' style={{ backgroundColor: colours.black }}>
            {submitting ? <Loader2 className='animate animate-spin' color='white' size={24}></Loader2> : <Send size={24} color='white'></Send>}
        </Button>
    )
}

export default SubmitButton
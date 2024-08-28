'use client'
import NewButton from '@/components/ui/NewButton'
import React from 'react'
import { merriweather } from '../fonts'
import { toast } from 'sonner'
type Props = {}

function ToastingUserSide({ }: Props) {
    return (
        <div id="userSide" className="hidden md:flex gap-2 h-full items-center">
            {/* after learning about authentication, put the login component here */}
            <NewButton noAnimation buttonVariant="ghost" actionOrLink={() => { toast("Click 'Learn' to get started!") }}>Pricing</NewButton>
            <NewButton noAnimation buttonVariant="ghost" actionOrLink={() => { toast("Click 'Learn' to get started!") }}>How it works</NewButton>
            <NewButton style={{ fontFamily: merriweather.style.fontFamily }} buttonVariant="black" actionOrLink="/home">Learn</NewButton>
        </div>
    )
}

export default ToastingUserSide
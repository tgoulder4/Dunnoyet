'use client'
import React from 'react'
import { useTimer } from 'react-timer-hook';
import { toast } from 'sonner';
function EndLessonTimer() {
    const {
        seconds
    } = useTimer({
        expiryTimestamp:
            new Date().setSeconds(new Date().getSeconds() + 10) as any,
        onExpire: () => process.env.NODE_ENV === 'production' ? window.location.href = '/home' : toast.error("10s elapsed"),
        autoStart: true,

    })
    return (
        <div>{seconds}</div>
    )
}

export default EndLessonTimer
'use client'
import { isProd } from '@/lib/constants';
import React from 'react'
import { useTimer } from 'react-timer-hook';
import { toast } from 'sonner';
function EndLessonTimer() {
    const {
        seconds
    } = useTimer({
        expiryTimestamp:
            new Date().setSeconds(new Date().getSeconds() + 10) as any,
        onExpire: () => isProd ? window.location.href = '/home' : toast.error("10s elapsed"),
        autoStart: true,

    })
    return (
        <div>{seconds}</div>
    )
}

export default EndLessonTimer
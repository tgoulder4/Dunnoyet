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
        onExpire: () =>
            window.location.href = '/home'
        // alert("10s elapsed")
        // { }
        ,
        autoStart: true,

    })
    // onExpire: () => window.location.href = '/home'
    return (
        <div>{seconds}</div>
    )
}

export default EndLessonTimer
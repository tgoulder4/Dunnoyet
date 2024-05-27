'use client'
import React from 'react'
import { useTimer } from 'react-timer-hook';
function EndLessonTimer() {
    const { seconds,
        minutes
    } = useTimer({
        expiryTimestamp:
            new Date().setSeconds(new Date().getSeconds() + 5) as any,
        onExpire: () => window.location.href = '/home',
        autoStart: true,

    })
    // onExpire: () => window.location.href = '/home'
    return (
        <div>{seconds} {minutes}</div>
    )
}

export default EndLessonTimer
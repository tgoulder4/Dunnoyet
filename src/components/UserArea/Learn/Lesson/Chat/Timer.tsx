'use client'
import React, { useState, useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';
export function LessonTimer() {
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: true });

    return (
        <div className='opacity-50'>{hours.toString().length == 1 ? '0' : ''}{hours}:{minutes.toString().length == 1 ? '0' : ''}{minutes}:{seconds.toString().length == 1 ? '0' : ''}{seconds}</div>
    );
}
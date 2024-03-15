'use server'
import { auth } from '@/auth';
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar';
import CreatingLesson from '@/components/UserArea/Learn/Lesson/New/CreatingLesson';
import { changeColour, colours, spacing } from '@/lib/constants'
import prisma from '@/lib/db/prisma';
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation';
import React from 'react'
var equal = require('deep-equal');
async function CreatingNewLessonLoader({ params }: { params: any }) {
    //redirect them before even  sending response to client to eliminate flickering
    const sess = await auth();
    if (!sess) redirect('/api/auth/signin');
    const userID = sess.user?.id;
    if (!userID) redirect('/api/auth/signin');
    const user = await prisma.user.findUnique({
        where: {
            id: userID
        }
    });
    if (!user) redirect('/api/auth/signin');
    //compare dates now and lastLessonCreatedAt and limit rate of creating new lessons
    const passedParams = params.params;
    console.log("LESSON PAGE params", passedParams);
    //find 'first' query e.g. /learn/lesson/new&first=true. I need the value of first
    const searchParams = new URLSearchParams(passedParams);
    const first = searchParams.get('first');


    //create a random integer between 0 and 3
    const random = Math.floor(Math.random() * 4);
    //create sayings for the loading screen - all synonyms for what question do you have. All diferently pharsed. Don't start with WHat's
    const sayings = first ? [
        //sayings for the first time users
        // Sayings for the first time users
        "What's on your mind?",
        "Get your burning questions ready...",
        "Let's embark on this learning adventure! - Eli",
        "Knowledge awaits!",
    ] : [
        //sayings for returning users
        "What's on your mind this time?",
        "Enjoying Dunnoyet? Spread the word!",
        "Great to see you again! What facts will we discover today? - Eli",
        "Welcome back! Let's continue our journey! - Eli",
    ]
    return (<CreatingLesson saying={
        sayings[random]
    } />
    )
}

export default CreatingNewLessonLoader
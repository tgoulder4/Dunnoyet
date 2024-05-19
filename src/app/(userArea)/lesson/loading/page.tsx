'use server'
import { auth } from '@/auth';
import MainAreaNavbar from '@/components/Navbar/MainAreaNavbar';
import CreatingLesson from '@/components/UserArea/Learn/Lesson/Loading/CreatingLesson';
import { changeColour, colours, spacing } from '@/lib/constants'
import prisma from '@/lib/db/prisma';
import { Loader2 } from 'lucide-react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { redirect } from 'next/navigation';
import React from 'react'
var equal = require('deep-equal');
async function LoadingLesson({ params }: { params: any }) {
    //redirect them before even  sending response to client to eliminate flickering
    return (<></>)
}

export default LoadingLesson
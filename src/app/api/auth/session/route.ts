import { auth } from '@/auth';
import { authConfig } from '@/auth.config';
import getServerSession from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const session = await auth();
    // console.log(session);
    return NextResponse.json(session);
}
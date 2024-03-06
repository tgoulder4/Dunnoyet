import getServerSession from 'next-auth';
import { authConfig } from '@/auth.config';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
export async function POST(req: NextRequest, res: NextResponse) {
    const sess = await getServerSession(authConfig).auth();
    console.log("sess: ", sess)
    if (!sess || !sess.user || sess.user.role !== 'ADMIN') return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const userID = sess.user?.id;
    if (!userID) return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    try {
        //they've just finished a lesson. save it here.
        const body = await req.json();
        switch (body.type) {
            case 'lesson':
                try {
                    await prisma.splitResponse.deleteMany();
                    await prisma.knowledgePoint.deleteMany();
                    await prisma.message.deleteMany();
                    await prisma.lessonState.deleteMany();
                    await prisma.metadata.deleteMany();
                    await prisma.lesson.deleteMany({});
                    return NextResponse.json({ message: "All lesson data has been deleted" }, { status: 200 });
                }
                catch (e) {
                    console.error(e)
                    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
                }

        }
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
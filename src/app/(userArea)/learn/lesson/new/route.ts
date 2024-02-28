import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';

export default async function POST(req: NextRequest) {
    //create a new lesson, get the lessonID from that lesson then redirect to /learn/lesson/[lessonID]
    if (!req.body) return NextResponse.json({ message: "No req body was provided." }, { status: 201 });
    const sess = await auth();
    if (!sess || !sess.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const { newQuestion } = await req.json();
    //make a new message as the newQuestion

    const lesson = await prisma.lesson.create({
        data: {
            messages: {
                create: {
                    content: newQuestion,
                    role: "user",
                }
            },
            user: {
                connect: {
                    id: sess.user.id
                }
            }
        }
    })
    if (!lesson) return NextResponse.json({ error: "Couldn't create the lesson." }, { status: 500 });
    return NextResponse.redirect(`/learn/lesson/${lesson.id}`);
}
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';

async function POST(req: NextRequest) {
    //create a new lesson, get the lessonID from that lesson then redirect to /learn/lesson/[lessonID]
    try {
        if (!req.body) return NextResponse.json({ message: "No req body was provided." }, { status: 201 });
        // const sess = await auth();
        // if (!sess || !sess.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
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
                        id: "65dbe7799c9c2a30ecbe6193"
                    }
                }
            }
        })
        console.log("lesson created: ", lesson);
        if (!lesson) return NextResponse.json({ error: "Couldn't create the lesson." }, { status: 500 });
        const url = req.nextUrl.clone();
        url.pathname = `/learn/lesson/${lesson.id}`;
        return NextResponse.redirect(url);
    } catch (error) {
        console.error("Error creating the lesson: ", error);
        return NextResponse.json({ error: "Couldn't create the lesson." }, { status: 500 });
    }
}
export { POST };
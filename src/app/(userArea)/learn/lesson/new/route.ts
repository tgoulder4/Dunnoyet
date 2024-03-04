import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import { getEmbedding } from "@/lib/chat/openai";
import { redirect } from "next/navigation";

async function POST(req: NextRequest) {
    //create a new lesson, get the lessonID from that lesson then redirect to /learn/lesson/[lessonID]
    try {
        if (!req.body) return NextResponse.json({ message: "No req body was provided." }, { status: 201 });
        const sess = await auth();
        if (!sess || !sess.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
        const userId = sess.user.id;
        if (!userId) return NextResponse.json({ error: "No user ID found." }, { status: 401 });
        const { newQuestion } = await req.json();
        const em = await getEmbedding(newQuestion);
        //make a new message as the newQuestion
        //create a new lesson, and a new lesson state. the lesson state's messages will be the new message
        console.log("Entered prisma create lesson transaction with Q: ", newQuestion);
        const lesson = await prisma.$transaction(async (tx) => {
            const lessonState = await tx.lessonState.create({
                data: {
                    messages: {
                        create: {
                            content: newQuestion,
                            role: "user"
                        }
                    },
                    metadata: {
                        create: {
                            knowledgePointChain: {
                                create: {
                                    source: "offered",
                                    userId: userId,
                                    lessonId: "65dbe7799c9c2a30ecbe6193",
                                    pointInSolitude: newQuestion,
                                    pointInChain: newQuestion,
                                    TwoDCoOrdinates: [],
                                    vectorEmbedding: em,
                                    confidence: 5
                                }
                            },
                            subjects: [],
                            currentKnowledgePointIndex: 0,
                            threads: [],
                        }
                    }
                }
            });
            console.log("lessonState created: ", lessonState);
            const lesson = await tx.lesson.create({
                data: {
                    stateId: lessonState.id,
                    userId: userId,
                    subjects: [],
                }
            });
            console.log("lesson created: ", lesson);
            //connect the knowledge point to the lesson
            // const kp = await tx.knowledgePoint.update({
            //     where: {
            //         id: lessonState.metadata.knowledgePointChain[0].id
            //     },
            //     data: {
            //         lessonId: lesson.id
            //     }
            // });
            return lesson;
        });
        if (!lesson) return NextResponse.json({ error: "Couldn't create the lesson." }, { status: 500 });
        const url = req.nextUrl.clone();
        url.pathname = `/learn/lesson/${lesson.id}`;
        return NextResponse.json({ message: { url: url.toString() } }, { status: 201 })
    } catch (error) {
        console.error("Error creating the lesson: ", error);
        return NextResponse.json({ error: "Couldn't create the lesson." }, { status: 500 });
    }
}
export { POST as POST }
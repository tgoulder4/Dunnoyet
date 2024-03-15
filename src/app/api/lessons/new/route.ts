'use server'
import getServerSession from 'next-auth';
import { putLessonSchema } from "@/lib/validation/parseTypes";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import prisma from '@/lib/db/prisma';
import { IKnowledge, ILesson, ILessonState, IMessage, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload, IMetadata } from '@/lib/validation/enforceTypes';
export async function GET(req: NextRequest) {
    console.log("Entered handler")
    const sess = await getServerSession(authConfig).auth();
    const url = req.nextUrl.clone()
    if (!sess) return NextResponse.redirect(url.host + "/api/error?err=ERR7");
    const userID = sess.user?.id;
    if (!userID) return NextResponse.redirect(url.host + "/api/error?err=ERR7");
    try {
        const body = await req.json();
        if (!body._userID) return NextResponse.redirect(url.host + "/api/error?err=ERR4");
        const { _userID } = body;
        if (_userID !== userID) return NextResponse.redirect(url.host + "/api/error?err=ERR5");
        const less = await prisma.$transaction(async (tx) => {
            console.log("Creating lesson for user: ", userID)
            const createdLesson = tx.lesson.create({
                data: {
                    user: {
                        connect: { id: userID }
                    },
                    ls: {
                        create: {
                            //new messages should be an empty array
                            newMessages: { create: [] as IMessage[] },
                            oldMessages: { create: [] as IMessage[] },
                            metadata: {
                                create: {
                                    subjects: [], currentKnowledgePointIndex: 0,
                                }
                            }
                        }
                    }
                } as any,
            });
            console.log("Created lesson: ", createdLesson)
            return createdLesson;
        })
        //return the lesson ID
        return NextResponse.json({ lessonID: less.id, link: `/learn/lesson/${less.id}` });
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Something went wrong with creating the lesson." }, { status: 500 });
    }
    return NextResponse.json({ error: "Something went wrong with creating the lesson." }, { status: 500 });
}
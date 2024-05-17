'use server'
import getServerSession from 'next-auth';
import { putLessonSchema } from "@/lib/validation/parseTypes";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import prisma from '@/lib/db/prisma';
import { IKnowledge, ILesson, ILessonState, IMessage, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload, IMetadata } from '@/lib/validation/enforceTypes';
export async function POST(req: NextRequest) {
    console.log("Entered handler")
    const sess = await getServerSession(authConfig).auth();
    const _url = req.nextUrl.clone()
    const url = _url.origin;
    if (!sess) return NextResponse.json({ error: "You need to be signed in to create a lesson.", link: url + "/api/auth/signin" }, { status: 401 });
    const userID = sess.user?.id;
    if (!sess) return NextResponse.json({ error: "You need to be signed in to create a lesson.", link: url + "/api/auth/signin" }, { status: 401 });
    try {
        const body = await req.json();
        if (!body._userID) return NextResponse.json({ error: "Something went wrong.", link: url + "/api/error&err=4" }, { status: 401 });
        const { _userID } = body;
        if (_userID !== userID) return NextResponse.json({ error: "Something went wrong.", link: url + "/api/error&err=5" }, { status: 401 });
        //check when they last created the lesson
        const user = await prisma.user.findUnique({
            where: {
                id: userID
            }
        });
        if (!user) return NextResponse.json({ error: "Something went wrong.", link: url + "/api/error&err=4" }, { status: 401 });
        //limiter
        // if (user.lastCreatedLessonAt) {
        //     const now = new Date();
        //     const last = user.lastCreatedLessonAt;
        //     const diff = now.getTime() - last.getTime();
        //     //1 lesson every 15 mins for free users, every 5 mins for premium users
        //     const diffInMinutes = diff / 1000 / 60;
        //     if (user.isPremium) {
        //         if (diffInMinutes < 5) return NextResponse.json({ error: "Something went wrong.", link: url + "/learn&msg=too+fast" }, { status: 400 });
        //     } else {
        //         if (diffInMinutes < 15) return NextResponse.json({ error: "Something went wrong.", link: url + "/learn&msg=too+fast+free" }, { status: 400 });
        //     }
        // }
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
            //update the user's lastCreatedLessonAt
            await tx.user.update({
                where: {
                    id: userID
                },
                data: {
                    lastCreatedLessonAt: new Date()
                }
            });
            return createdLesson;
        })
        //return the lesson ID
        //DEV: mock lesson
        // console.log("Returning mock lesson")
        // const less: ILesson = {
        //     id: "1",
        //     userID: "1",
        //     beganAt: new Date(),
        //     endedAt: null,
        //     lessonState: {
        //         newMessages: [],
        //         oldMessages: [],
        //         metadata: {
        //             subjects: [],
        //             lessonID: "1",
        //             threads: [],
        //             knowledgePointChain: [],
        //             currentKnowledgePointIndex: 0
        //         }
        //     }
        // }
        return NextResponse.json({ lessonID: less.id, link: url + `/learn/lesson/${less.id}` });
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Something went wrong with creating the lesson." }, { status: 500 });
    }
    return NextResponse.json({ error: "Something went wrong with creating the lesson." }, { status: 500 });
}
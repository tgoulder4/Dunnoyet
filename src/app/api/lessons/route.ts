'use server'
import getServerSession from 'next-auth';
import { putLessonSchema } from "@/lib/validation/parseTypes";
import { NextRequest, NextResponse } from "next/server";

import { getEmbedding } from "@/lib/chat/openai";

import { authConfig } from "@/auth.config";
import { z } from 'zod';
import prisma from '@/lib/db/prisma';
import { IKnowledge, ILesson, ILessonState, IMessage, IMessagesEndpointResponsePayload, IMessagesEndpointSendPayload, IMetadata } from '@/lib/validation/enforceTypes';
import { knowledgeIndex } from '@/lib/chat/pinecone';
import { getNextMessage } from '@/lib/chat/Eli/eli';

export async function GET(req: NextRequest) {
    console.log("Get request to /api/lessons/ called")
    try {
        const url = req.nextUrl.clone().basePath;
        const sess = await getServerSession(authConfig).auth();
        console.log("Session: ", sess)
        if (!sess) return NextResponse.redirect(url + "/api/auth/signin", { status: 401 });
        const userID = sess.user?.id;
        if (!userID) return NextResponse.redirect("/api/error?err=8", { status: 400 });
        const request = await req.json();
        console.log("Request body: ", request.body)
        let lesson: ILesson[] | ILesson | null = null;
        if (!request.body) return NextResponse.redirect(url + "/api/error?err=1", { status: 400 });
        const { startChunkFromIndex, lessonID } = request.body;
        if (!startChunkFromIndex && !lessonID) return NextResponse.redirect(url + "/api/error?err=9", { status: 400 });
        //they can use this api to get a certain lesson or multiple. If they don't provide a lessonID, we get all lessons
        if (req.body) {
            //find many lessons
            console.log("Finding this user's lessons...")
            try {
                const _userLessons = await prisma.user.findUnique({
                    where: {
                        id: userID
                    },
                    include: {
                        lessons: {
                            include: {
                                ls: {
                                    include: {
                                        metadata: {
                                            include: {
                                                knowledgePointChain: true,
                                            }
                                        },
                                        newMessages: true,
                                        oldMessages: true
                                    }
                                }
                            }
                        },
                    }
                }).then((user) => {
                    if (!user) {
                        console.error("!!!!!!! Returning an empty array as lessons since user wasn't found")
                        return []
                    };
                    //returns lessons without the metadata
                    return user.lessons;
                });
                lesson = _userLessons.map((l) => {
                    return {
                        id: l.id,
                        beganAt: l.beganAt,
                        endedAt: l.endedAt,
                        lessonState: {
                            newMessages: l.ls.newMessages as IMessage[],
                            oldMessages: l.ls.oldMessages as IMessage[],
                            metadata: {
                                ...l.ls.metadata,
                                knowledgePointChain: l.ls.metadata.knowledgePointChain as IKnowledge[],
                                lessonID: l.id,
                                threads: l.ls.metadata.threads as IMessage[][]
                            }
                        },
                    }
                });
            }
            catch (e) {
                console.error("Error in GET @route finding user lessons: ", e)
                return NextResponse.json({ error: "An error occurred FINDINGUSERLESSONS" }, { status: 500 });
            }

        } else {
            const body = await req.json();
            // console.log("body: ", body)
            if (!body.lessonID) return NextResponse.json({ error: "No lessonID provided in request." }, { status: 400 });
            const lessonID = body.lessonID;
            lesson = await getLesson(lessonID, userID);

        }
        if (!lesson) {
            return NextResponse.json({ error: "This lesson wasn't found, or there was an error @getLesson." }, { status: 400 });
        }
        // console.log("Lessons: ")
        // console.dir(lesson, { depth: null })
        return NextResponse.json({ lesson }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
//GOOD KNOWLEDGE POINT: ['Velcoity has both magnitude and direction, like a vector on the cartesian plane.'], BAD: ['It has both magnitude and direction.']
//each time they've answered a 'what helps you understand this?' question or press 'i understand this!' after high depth levels of questioning, we push this to knowledgePointsFromLesson

/**
 * 
 * @param req Like {newQuestion: "What is velocity?"} | IMessagesEndpointSendPayload
 * @returns Like {error:string|zodIssue} | {resp: {IMessagesEndpointResponsePayload | string}}
 */
export async function PUT(req: NextRequest) {
    const sess = await getServerSession(authConfig).auth();
    if (!sess) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const userID = sess.user?.id;
    if (!userID) return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    // FOR EX SECURITY BUT LONGER WAIT TIME ON RESPONSE
    // const user = await prisma.user.findUnique({
    //     where: {
    //         id: userID
    //     }
    // });
    // if (!user) return NextResponse.json({ error: "ERR4" }, { status: 400 });
    try {
        const body = await req.json();
        const parseResult = putLessonSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: parseResult.error.errors }, { status: 400 });
        }
        let payload: IMessagesEndpointSendPayload = parseResult.data;
        console.log("Payload: ", payload)
        let status = 201;

        //they passed a lesson to get the next message - do all verficiation checks
        const lessonExists = await prisma.lesson.findUnique({
            where: {
                id: payload.metadata.lessonID,
                userId: userID
            }
        });
        console.log("Lesson exists: ", lessonExists)
        //if it doesn't exist or is already completed, return an error
        if (!lessonExists || lessonExists.endedAt) {
            return NextResponse.json({ error: "ERR3" }, { status: 400 });
        }

        console.log("[/API/LESSONS/PUT] Payload: ", payload)

        let resp: IMessagesEndpointResponsePayload | string = await getNextMessage(payload);
        if (typeof resp === "string") {
            status = 400;
        } else {
            //if the action is completed, set that in db
            if (resp.metadata.action == "ENDLESSON") {
                await prisma.lesson.update({
                    where: {
                        id: payload.metadata.lessonID
                    },
                    data: {
                        endedAt: new Date(),
                    }
                });
                //append the knowledgepoints from the lesson to the user's knowledgepoints
                await prisma.user.update({
                    where: {
                        id: userID
                    },
                    data: {
                        knowledgePoints: {
                            createMany: {
                                data: resp.metadata.knowledgePointChain.map((k: IKnowledge) => {
                                    return { ...k, userId: userID }
                                }) as any
                            }
                        }
                    }
                });
            }
        }
        console.log("Response from getNextMessage: ", resp)
        return NextResponse.json({ resp }, { status });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
//i wanna change all my types into zod schemas
export async function getLesson(lessonID: string, userID: string): Promise<ILesson | null> {
    console.log("getLesson called with lessonID: ", lessonID)
    try {
        const fetchedLesson = await prisma.lesson.findUnique({
            where: {
                id: lessonID,
                userId: userID
            },
            include: {
                ls: {
                    include: {
                        newMessages: true,
                        oldMessages: true,
                        metadata: {
                            include: {
                                knowledgePointChain: true,

                            }
                        }
                    }
                }
            }
        });
        if (!fetchedLesson) return null;
        console.log("getLesson is returning lesson: ", fetchedLesson)
        //convert the lessonState to the correct type
        const lesson: ILesson = {
            id: fetchedLesson.id,
            beganAt: fetchedLesson.beganAt,
            endedAt: fetchedLesson.endedAt,
            lessonState: {
                newMessages: fetchedLesson.ls.newMessages as IMessage[],
                oldMessages: fetchedLesson.ls.oldMessages as IMessage[],
                metadata: {
                    ...fetchedLesson.ls.metadata,
                    //threads is a prisma json value so we need to parse it
                    knowledgePointChain: fetchedLesson.ls.metadata.knowledgePointChain as IKnowledge[],
                    lessonID: fetchedLesson.id,
                    threads: fetchedLesson.ls.metadata.threads as IMessage[][]
                }
            },
        }
        return lesson;
    } catch (e) {
        console.error("Error in getLesson @route: ", e);
        return null;
    }
}

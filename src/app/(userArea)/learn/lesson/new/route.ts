import { metadata } from './../../../../auth/register/page';
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import { getEmbedding } from "@/lib/chat/openai";
import { redirect } from "next/navigation";
import { getTwoDCoOrdinatesOfEmbeddings } from '@/components/UserArea/Learn/Lesson/network';
import { getNextMessage } from '@/lib/chat/Eli/eli';

async function POST(req: NextRequest) {
    //create a new lesson, get the lessonID from that lesson then redirect to /learn/lesson/[lessonID]
    try {
        if (!req.body) return NextResponse.json({ message: "No req body was provided." }, { status: 201 });
        const sess = await auth();
        if (!sess || !sess.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
        const userId = sess.user.id;
        if (!userId) return NextResponse.json({ error: "No user ID found." }, { status: 401 });
        const { newQuestion }: { newQuestion: string } = await req.json();
        //make a new message as the newQuestion
        //create a new lesson, and a new lesson state. the lesson state's messages will be the new message
        console.log("Entered prisma create lesson transaction with Q: ", newQuestion);
        //if newMessages content is of type splitResponse, change 'content' key to 'splitResponse'
        const res = await getNextMessage({
            messages: [{ content: newQuestion, role: "user" }],
            metadata: {
                metadataId: "65dbe7799c9c2a30ecbe6100",
                lessonID: "65dbe7799c9c2a30ecbe6193",
                threads: [],
                subjects: [],
                knowledgePointChain: [],
                currentKnowledgePointIndex: 0,
            }
        });
        if (typeof res === "string") return NextResponse.json({ error: res }, { status: 500 });
        const {
            newMessages, metadata
        } = res;
        console.log("Response from getNextMessage: ", res)
        const lessAndState = await prisma.$transaction(async (tx) => {
            const lessonState = await tx.lessonState.create({
                data: {
                    messages: {
                        create: [{
                            content: newQuestion,
                            role: "user"
                        },
                        ...newMessages]
                    },
                    metadataId: "65dbe7799c9c2a30ecbe6100",
                    // metadata: 
                    // {
                    //     create: {
                    //         knowledgePointChain: {
                    //             create: {
                    //                 source: "offered",
                    //                 userId: userId,
                    //                 lessonId: "65dbe7799c9c2a30ecbe6193",
                    //                 pointInSolitude: newQuestion,
                    //                 pointInChain: newQuestion,
                    //                 TwoDCoOrdinates: [],
                    //                 vectorEmbedding: em,
                    //                 confidence: 5
                    //             }
                    //         },
                    //         subjects: [],
                    //         currentKnowledgePointIndex: 0,
                    //         threads: [],
                    //     }
                    // }
                }
            });
            console.log("TEMP: lessonState created: ", lessonState);
            const lesson = await tx.lesson.create({
                data: {
                    stateId: lessonState.id,
                    userId: userId,

                }
            });
            console.log("lesson created: ", lesson);
            //connect the knowledge point's ID to this lesson just made
            const createdMetadata = await tx.metadata.create({
                data: {
                    knowledgePointChain: {
                        create: [
                            ...metadata.knowledgePointChain.map((k) => {
                                return {
                                    ...k,
                                    userId: userId,
                                    lessonId: lesson.id
                                }
                            })
                        ]
                    },
                    subjects: metadata.subjects,
                    currentKnowledgePointIndex: metadata.currentKnowledgePointIndex,
                    threads: metadata.threads,
                }
            });
            console.log("metadata created: ", metadata)
            //change lessonState's metadataId to the metadata's ID
            const newLessonState = await tx.lessonState.update({
                where: { id: lessonState.id },
                data: {
                    metadataId: createdMetadata.id
                }
            });
            console.log("LessonState updated to ", newLessonState);
            return { less: lesson, state: newLessonState };
        });
        if (!lessAndState.less) return NextResponse.json({ error: "Couldn't create the lesson." }, { status: 500 });
        console.log("Lesson and state created: ", lessAndState);
        return NextResponse.json({ message: { lesson: lessAndState.less.id, state: lessAndState.state.id } }, { status: 201 })
    } catch (error) {
        console.error("Error creating the lesson: ", error);
        return NextResponse.json({ error: "Couldn't create the lesson." }, { status: 500 });
    }
}
export { POST as POST }

//SUMMARY
// lesson/new now calls getNextMessage to return newMessages[] and metadata
// then it creates a new lesson and a new lessonState
// then it creates a new metadata
// then it updates the lessonState to have the new metadata
// then it returns the lesson and lessonState IDs
//but I want the newMessages to be returned within chatWithEli
//so just push these messages to the lesson state, the lesson state ID is passed as url params anyway.
//then within chatwithEli retrieve the lesson state. Maybe pass the question as well for faster percieved response time.
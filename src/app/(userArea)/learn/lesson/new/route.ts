import { metadata } from './../../../../auth/register/page';
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import { getEmbedding } from "@/lib/chat/openai";
import { redirect } from "next/navigation";
import { getTwoDCoOrdinatesOfEmbeddings } from '@/components/UserArea/Learn/Lesson/network';
import { getNextMessage } from '@/lib/chat/Eli/eli';
import { randomBytes } from 'crypto';

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

        //some responses could be a splitResponse, which is a model so we must create it. this produces the correct invocation of the prisma create method
        const firstSrMsg = newMessages.filter(nm => nm.splitResponse)[0];
        if (!firstSrMsg || !firstSrMsg.splitResponse) return NextResponse.json({ error: "Couldn't add the firstSrMsg to lessonState as it was falsy." }, { status: 500 });
        const lessAndState = await prisma.$transaction(async (tx) => {
            const createdSplitResponse = await tx.splitResponse.create({
                data: {
                    id: randomBytes(12).toString('hex'),
                    text: firstSrMsg!.splitResponse!.text,
                    active: firstSrMsg!.splitResponse!.active
                }
            });

            const lessonState = await tx.lessonState.create({
                data: {
                    messages: {
                        create: {
                            content: newQuestion,
                            //generate a 12 byte ID for the message
                            role: "user"
                        },
                    },
                    metadataId: "65dbe7799c9c2a30ecbe6100", //will be overwritten with a real metadata ID in a few lines
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
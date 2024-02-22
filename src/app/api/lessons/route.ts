'use server'
import getServerSession from 'next-auth';
import { auth } from "@/auth";
import { createLessonSchema } from "@/lib/validation/parseTypes";
import { NextRequest, NextResponse } from "next/server";

import { getEmbedding } from "@/lib/chat/openai";

import { authConfig } from "@/auth.config";
import { z } from 'zod';
import { getLessons } from '@/actions';
import prisma from '@/lib/db/prisma';
import { IKnowledge, ILesson, IMessage } from '@/lib/validation/enforceTypes';
import { knowledgeIndex } from '@/lib/chat/pinecone';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const parseResult = createLessonSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: parseResult.error.errors }, { status: 400 });
        }
        const lesson = parseResult.data;
        const sess = await getServerSession(authConfig).auth();
        if (!sess) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
        return NextResponse.json({ message: sess }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
//GOOD KNOWLEDGE POINT: ['Velcoity has both magnitude and direction, like a vector on the cartesian plane.'], BAD: ['It has both magnitude and direction.']
//each time they've answered a 'what helps you understand this?' question or press 'i understand this!' after high depth levels of questioning, we push this to knowledgePointsFromLesson
const knowledgePointsFromLesson = ["test"];

//on end lesson click - discard messages once knowledge points retrieved, create embedding:
async function getAllEmbeddingForLessonKnowledgePoints(knps: IKnowledge[]) {
    // return getEmbedding(knowledge);
    return knps.map(knp => getEmbedding(knp.point));
}
export async function POST(req: NextRequest, res: NextResponse) {
    const sess = await getServerSession(authConfig).auth();
    console.log("sess: ", sess)
    if (!sess) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const userID = sess.user?.id;
    if (!userID) return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });


    try {
        const body = await req.json();
        const parseResult = createLessonSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: parseResult.error.errors }, { status: 400 });
        }
        console.log("Parseresult.data: " + parseResult.data);
        //Posting {lessonID,lessonStatus} to ensure people can't add as many knowledgepoints as they want via this endpoint
        const lessonTheySent: z.infer<typeof createLessonSchema> = parseResult.data;
        if (!lessonTheySent.id || !lessonTheySent.status) return NextResponse.json({ error: "Lesson id or status not given in request @POST" }, { status: 400 });
        const lessonFromDB = await getLesson(lessonTheySent.id);
        if (!lessonFromDB) return NextResponse.json({ error: "Lesson not found with given lesson ID @POST" }, { status: 404 });
        //the cool stuff
        const { knowledgePointsFromLesson,
            status,
            subject,
            updatedAt,
            beganAt,
            messages,
        } = lessonTheySent;
        const embeddings = await Promise.all(await getAllEmbeddingForLessonKnowledgePoints(knowledgePointsFromLesson));
        const knowledgePointsTransaction = await prisma.$transaction(async (tx) => {
            const lesson = await tx.lesson.update({
                where: {
                    id: id,
                },
                data: lesson
            });
            for (const embedding of embeddings) {
                await knowledgeIndex.upsert([{
                    id: lesson.id,
                    values: embedding,
                }])
            }
            return lesson;
        })

        return NextResponse.json({ message: sess }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
//i wanna change all my types into zod schemas
type UpdateLesson = {
    id: string;
    status?: string;
    subject: string;
    updatedAt: string;
    beganAt: string;
    messages: IMessage[];
    knowledgePointsFromLesson: IKnowledge[];

}
async function getLesson(lessonID: string): Promise<UpdateLesson | null> {
    console.log("getLesson called with lessonID: ", lessonID)
    try {
        const lesson = await prisma.lesson.findUnique({
            where: {
                id: lessonID,
            },
        });
        if (!lesson) return null;
        console.log("getLesson is returning lesson: ", lesson)
        return lesson as UpdateLesson;
    } catch (e) {
        console.error("Error in getLesson @route: ", e);
        return null;
    }
}
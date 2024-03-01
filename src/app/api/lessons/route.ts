'use server'
import getServerSession from 'next-auth';
import { auth } from "@/app/api/auth/[...nextauth]";
import { createLessonSchema, putLessonSchema } from "@/lib/validation/parseTypes";
import { NextRequest, NextResponse } from "next/server";

import { getEmbedding } from "@/lib/chat/openai";

import { authConfig } from "@/auth.config";
import { z } from 'zod';
import { getLessons } from '@/actions';
import prisma from '@/lib/db/prisma';
import { IKnowledge, ILesson, ILessonState, IMessage } from '@/lib/validation/enforceTypes';
import { knowledgeIndex } from '@/lib/chat/pinecone';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const sess = await getServerSession(authConfig).auth();
        if (!sess) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
        const body = await req.json();
        console.log("body: ", body)
        if (!body.lessonID) return NextResponse.json({ error: "No lessonID provided in request." }, { status: 400 });
        const lessonID = body.lessonID;
        const lesson = await getLesson(lessonID);
        if (!lesson) {
            return NextResponse.json({ error: "This lesson wasn't found, or there was an error @getLesson." }, { status: 400 });
        }
        return NextResponse.json({ lesson: lesson }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
//GOOD KNOWLEDGE POINT: ['Velcoity has both magnitude and direction, like a vector on the cartesian plane.'], BAD: ['It has both magnitude and direction.']
//each time they've answered a 'what helps you understand this?' question or press 'i understand this!' after high depth levels of questioning, we push this to knowledgePointsFromLesson

//on end lesson click - discard messages once knowledge points retrieved, create embedding:
// async function getAllEmbeddingForLessonKnowledgePoints(knps: IKnowledge[]) {
//     // return getEmbedding(knowledge);
//     return knps.map(knp => getEmbedding(knp.point));
// }
export async function PUT(req: NextRequest, res: NextResponse) {
    const sess = await getServerSession(authConfig).auth();
    if (!sess) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const userID = sess.user?.id;
    if (!userID) return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    try {
        const body = await req.json();
        const parseResult = putLessonSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: parseResult.error.errors }, { status: 400 });
        }
        const lesson = parseResult.data;
        const modifiedLesson = await prisma.lesson.update({
            where: {
                id: lesson.id,
            },
            data: {
                subjects: lesson.subjects,
                lessonStatus: lesson.lessonStatus,
                messages: { create: lesson.messages },
                knowledgePointChain: { create: lesson.knowledgePointsFromLesson }
            },
        });
        return NextResponse.json({ message: "Lesson modified: " + modifiedLesson }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
export async function POST(req: NextRequest, res: NextResponse) {
    const sess = await getServerSession(authConfig).auth();
    console.log("sess: ", sess)
    if (!sess) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const userID = sess.user?.id;
    if (!userID) return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    try {
        //they've just finished a lesson. save it here.
        const body = await req.json();
        const parseResult = createLessonSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: parseResult.error.errors }, { status: 400 });
        }
        console.log("Parseresult.data: " + parseResult.data);
        //Posting {lessonID,lessonStatus} to ensure people can't add as many knowledgepoints as they want via this endpoint
        const LessonTheySent: z.infer<typeof createLessonSchema> = parseResult.data;
        if (!LessonTheySent) return NextResponse.json({ error: "Lesson not correctly given in request @POST" }, { status: 400 });
        //create new lesson
        const less = await prisma.lesson.create({
            data: {
                userId: userID,
                subjects: LessonTheySent.subjects,
                lessonStatus: "Active",
                messages: { create: LessonTheySent.messages },
                knowledgePointChain: { create: LessonTheySent.knowledgePointsFromLesson }
            }
        });
        return NextResponse.json({ message: "Lesson_Created: " + less }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
//i wanna change all my types into zod schemas
export async function getLesson(lessonID: string): Promise<ILesson | null> {
    console.log("getLesson called with lessonID: ", lessonID)
    try {
        const lesson = await prisma.lesson.findUnique({
            where: {
                id: lessonID,
            },
            include: {
                knowledgePointChain: true,
            }
        });
        if (!lesson) return null;
        console.log("getLesson is returning lesson: ", lesson)
        return lesson as ILesson;
    } catch (e) {
        console.error("Error in getLesson @route: ", e);
        return null;
    }
}

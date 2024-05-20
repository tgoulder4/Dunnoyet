import { createLessonSchema, lessonStatePayloadSchema } from './../../../lib/validation/transfer/transferSchemas';
import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
import { getLoggedInUser } from './auth';
import { User } from 'next-auth';
import { z } from 'zod';
const prisma = prismaClient;
export const runtime = 'edge';
export const getLesson = async (id: string) => {
    console.log("getLesson called with id: ", id)
    const lessonFound = prisma.lesson.findUnique({
        where: { id: id },
        select: {
            stage: true,
            targetQ: true,
            beganAt: true,
            endedAt: true,
            userId: true,
        }
    })
    return lessonFound;
}
export const createLesson = async (userID: string, data: z.infer<typeof createLessonSchema>) => {
    console.log("createLesson called")
    if (!userID) {
        console.error("No user logged in @createLesson")
        return null
    };
    const {
        mode,
        content
    } = data;
    if (!content || !mode) return null;
    if (mode == "New Question") {
        const lesson = await prisma.lesson.create({
            data: {
                userId: userID,
                targetQ: content,
                stage: 'Purgatory',
            }
        });
        return lesson;
    } else if (mode == "Free Roam") {
        const lesson = await prisma.lesson.create({
            data: {
                userId: userID,
                stage: 'Purgatory',
            }
        });
        return lesson;
    }
    return null;
    //create lesson function should only perform that action, and return the lesson object.
    if (mode == "New Question") {
        // const lesson = await prisma.lesson.create({
        //     data: {
        //         userId: userID,
        //         targetQ: content,
        //         stage: 'Purgatory',
        //         messages: {
        //             create: {
        //                 role: 'eli',
        //                 content: 'What comes to mind?',
        //                 eliResponseType: 'WhatComesToMind',
        //             }
        //         }
        //     }
        // });
    }
    else if (mode == "Free Roam") {
        // const lesson = await prisma.lesson.create({
        //     data: {
        //         userId: userID,
        //         stage: 'Purgatory',
        //         messages: {
        //             create: {
        //                 role: 'user',
        //                 content,
        //             }
        //         }
        //     },
        //     include:{
        //         messages:true
        //     }
        // });
    }
}
const app = new Hono()
    // .get('/:id', async (c) => {
    //     const id = c.req.param('id');
    //     const lesson = await getLesson(id);
    //     if (!lesson) return c.status(404);
    //     return c.json(lesson)
    // })
    .get('/new', async (c) => {
        const user = await getLoggedInUser();
        if (!user || !user.id) return c.status(401);
        const body = await c.req.json();
        console.log("Body: ", body)
        // const parseResult = createLessonSchema.safeParse(body);
        // if (!parseResult.success) return c.status(400);
        // const data = parseResult.data;
        // const lesson = await createLesson(user.id, data);
        // if (!lesson) return c.status(500);
        return c.json(`/lesson/${"lesson.id"}/loading`)
    })


export default app;

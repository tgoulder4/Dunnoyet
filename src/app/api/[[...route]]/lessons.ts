import { createLessonSchema, lessonStatePayloadSchema } from './../../../lib/validation/transfer/transferSchemas';
import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
import { getLoggedInUser } from './auth';
import { User } from 'next-auth';
import { z } from 'zod';
import { create } from 'domain';
import { connect } from 'http2';
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
            messages: true
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
        const sayings = [
            "What's the closest thing in this topic that makes complete sense you?",
            "What's the closest thing you understand around this topic?",
            "What are you confident about so far in this topic?",
            "Can you describe what you've grasped so far in this topic?",
            "What part of this topic do you feel you understand best?",
            "What have you confidently mastered in this topic?"
        ]
        const randomSaying = sayings[Math.floor(Math.random() * sayings.length)];
        try {
            const lesson = await prisma.$transaction(async (tx) => {
                const targetQ = await tx.targetQ.create({
                    data: {
                        point: content,
                    }
                })
                const less = await tx.lesson.create({
                    data: {
                        userId: userID,
                        targetQId: targetQ.id,
                        messages: {
                            create: {
                                content: randomSaying,
                                role: "eli",
                                eliResponseType: "WhatComesToMind"
                            }
                        }
                    }
                });
                return less;
            })

            return lesson;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    } else if (mode == "Free Roam") {
        const lesson = await prisma.lesson.create({
            data: {
                userId: userID,
                messages: {
                    createMany: {
                        data: [
                            {
                                content: content,
                                role: "user",

                            },
                            //REWIND TO HERE.. GENERATE REPLY FROM ELI and enter below
                            {
                                content: content,
                                role: "user",
                                userResponseType: "UserInput"
                            }
                        ]
                    }
                }
            }
        });
        return lesson;
    }
    return null;

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
        const mode = c.req.query("mode");
        if (mode !== "New Question" && mode !== "Free Roam") return c.status(400);
        const content = c.req.query("content");
        if (!mode || !content) return c.status(400);
        const lesson = await createLesson(user.id, { mode, content });
        if (!lesson) return c.status(500);
        return c.json(`/lesson/${"lesson.id"}/loading`)
    })


export default app;

import { getLoggedInUser } from '@/app/api/[[...route]]/auth';
import { createLessonSchema } from './../../../lib/validation/transfer/transferSchemas';
import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
import { z } from 'zod';
import { getTeachingResponse } from '@/lib/chat/Eli/core/core';
import { simplifyToSubject } from '@/lib/chat/Eli/helpers/simplify-message';
import { checkIsUserRight } from '@/lib/chat/Eli/helpers/correctness';
import { oopsThatsNotQuiteRight, tellMeWhatYouKnow } from '@/lib/chat/Eli/helpers/sayings';
import { messagesSchema } from '@/lib/validation/primitives';
import openai from '@/lib/chat/openai';
const prisma = prismaClient;
export const runtime = 'edge';
export const getLesson = async (id: string) => {
    console.log("getLesson called with id: ", id)
    const lessonFound = prisma.lesson.findFirst({
        where: { id: id },
        select: {
            messages: true,
            targetQ: true,
            stage: true,
            beganAt: true,
            subject: true
        }
    })
    return lessonFound;
}
export const initiateLesson = async (id: string) => {
    //if there's a targetQ
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
        const randomSaying = tellMeWhatYouKnow();
        console.log("Random saying: ", randomSaying)
        try {
            const lesson = await prisma.$transaction(async (tx) => {
                console.log("Transaction started")
                const targetQ = await tx.targetQ.create({
                    data: {
                        point: content,
                    }
                })
                const less = await tx.lesson.create({
                    data: {
                        userId: userID,
                        targetQId: targetQ.id,
                    }
                });
                //optional 1-1 relations are not yet available via mongodb and prisma. This is a workaround
                const metadata = await tx.metadata.create({
                    data: {
                        imageURL: "",
                    }
                })
                const msg = await tx.message.create({
                    data: {
                        lessonId: less.id,
                        content: randomSaying,
                        role: "eli",
                        eliResponseType: "WhatComesToMind",
                        metadataId: metadata.id,
                        distanceAwayFromFinishingLesson: 10
                    }
                })
                return less;
            })
            return lesson;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    } else if (mode == "Free Roam") {
        const isRight = await checkIsUserRight([{ role: "user", content: content }], content);
        //if !right stage="puragtory" else stage="main"
        let reply: z.infer<typeof messagesSchema>;
        const subject = await simplifyToSubject(content);
        if (!subject) return null;
        if (isRight) {
            const teachingRes = await getTeachingResponse([{ role: "user", content: content } as any], [], content);
            if (!teachingRes) return null;
            try {
                const kp = await prisma.knowledgePoint.create({
                    data: {
                        KP: teachingRes.KP?.point!,
                        confidence: 2,
                        source: 'reinforced',
                        TwoDvK: teachingRes.KP?.TwoDvK,
                        user: {
                            connect: {
                                id: userID
                            }
                        }
                    }
                })
                reply = {
                    eliResponseType: "General",
                    content: teachingRes.content,
                    role: "eli",
                    KPId: kp.id
                }
            }
            catch (e) {
                console.error(e);

                return null;
            }
        }
        else {
            //thery#re not right
            reply = {
                eliResponseType: "WhatComesToMind",
                content: oopsThatsNotQuiteRight(),
                role: "eli",
            }
        }
        const lesson = await prisma.lesson.create({
            data: {
                userId: userID,
                stage: isRight ? "main" : "purgatory",
                subject: subject,
                messages: {
                    createMany: {
                        data: [
                            {
                                content: content,
                                role: "user",

                            },
                            reply
                        ]
                    }
                }
            }
        });
    }

}
const app = new Hono()
    .get('/new', async (c) => {
        console.log("GET /api/lessons/new called")
        const user = await getLoggedInUser();
        if (!user || !user.id) return c.status(401);
        console.log("User logged in: ", user)
        console.log("Request received: ", c.req.url)
        const mode = c.req.query("mode");
        if (mode !== "New Question" && mode !== "Free Roam") {
            console.log("Invalid mode, " + mode)
            return c.status(400)
        };
        const content = c.req.query("content");
        if (!mode || !content) {
            console.log("No mode or content")
            return c.status(400)
        };
        const lesson = await createLesson(user.id, { mode, content });
        if (!lesson) return c.status(500);
        console.log("Returning lesson: ", lesson)
        return c.json(lesson)
    })
export default app;

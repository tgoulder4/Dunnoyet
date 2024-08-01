
import { getLoggedInUser } from '@/app/api/[[...route]]/auth';
import { createLessonSchema } from './../../../lib/validation/transfer/transferSchemas';
import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
import { z } from 'zod';
import { getTeachingResponse } from '@/lib/chat/Eli/core/core';
import { simplifyToKnowledgePointInSolitude, simplifyToSubject } from '@/lib/chat/Eli/helpers/simplify-message';
import { checkIsUserRight } from '@/lib/chat/Eli/helpers/correctness';
import { oopsThatsNotQuiteRight, tellMeWhatYouKnow } from '@/lib/chat/Eli/helpers/sayings';
import { messagesSchema } from '@/lib/validation/primitives';
import openai, { getEmbedding } from '@/lib/chat/openai';
import { getTwoDCoOrdinatesOfKPInSolitude } from '@/components/UserArea/Learn/Lesson/Network/utils/helpers';
import { randomBytes } from 'crypto';
const prisma = prismaClient;
export const runtime = 'edge';
const isProd = process.env.NODEENV === "production";
export const getLesson = async (id: string, noAuthCheck?: boolean) => {
    console.log("getLesson called with id: ", id)
    if (id.length < 24) return null; //incorrect id byte size
    const lessonFound = await prisma.lesson.findFirst({
        where: { id: id },
        select: {
            messages: {
                select: {
                    content: true,
                    role: true,
                    eliResponseType: true,
                    KP: {
                        select: {
                            confidence: true,
                            KP: true,
                            source: true,
                            TwoDvK: true,
                        }
                    }
                }
            },
            targetQ: true,
            stage: true,
            beganAt: true,
            subject: true,
            id: true,
            userId: true,
        }
    })
    if (!lessonFound) return null;
    console.log("Lesson found: ", lessonFound)
    if (!noAuthCheck) {
        const user = await getLoggedInUser();
        if (!user || !user.id) return null;
        if (!noAuthCheck && lessonFound && lessonFound.userId !== user.id) return null;
    }
    //due to caveats in prisma and mongodb, if there's a subject then there ISN'T a targetQ. This is a workaround
    if (lessonFound && lessonFound.subject) {
        lessonFound.targetQ = null
    }
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
        const randomSaying = tellMeWhatYouKnow();
        console.log("Random saying: ", randomSaying)
        try {
            // console.log("api/lesson.ts: Calling getTeachingResponse")
            // const res = await getTeachingResponse([{ role: 'user', content }]);
            // if (!res) {
            //     console.error("No response from Eli")
            //     return null;
            // }
            // const reply: z.infer<typeof messagesSchema> = res;
            // console.log("teachingResponse: ", reply)
            const lesson = await prisma.$transaction(async (tx) => {
                console.log("Transaction started")
                const targetQ = await tx.targetQ.create({
                    data: {
                        point: content,
                    }
                })
                const note = await tx.note.create({
                    data: {
                        content: "",
                    }
                });
                const less = await tx.lesson.create({
                    data: {
                        userId: userID,
                        targetQId: targetQ.id,
                        noteId: note.id,
                        stage: "purgatory",
                    }
                });
                const met = await tx.metadata.create({
                    data: {
                        imageURL: "",
                        references: [],
                    }
                });
                // if (!reply.KP) {
                //     console.error("No KP in reply")
                //     return;
                // }
                const msg = await tx.message.create({
                    data: {
                        content: randomSaying,
                        eliResponseType: "WhatComesToMind",
                        role: "eli",
                        //generate a random 12 byte string
                        KPId: randomBytes(12).toString('hex'),
                        // KP: {
                        //     create: {
                        //         confidence: 1,
                        //         KP: reply.KP.KP,
                        //         source: "offered" as "offered" | "reinforced",
                        //         userId: userID,
                        //         TwoDvK: reply.KP.TwoDvK
                        //     }
                        // },
                        // Lesson: {
                        //     connect: {
                        //         id: less.id
                        //     }
                        // },
                        lessonId: less.id,
                        // metadata: {
                        //     connect: {
                        //         id: met.id
                        //     }
                        // },
                        metadataId: met.id
                    }
                });
                //optional 1-1 relations are not yet available via mongodb and prisma. This is a workaround
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
        console.log("Subject: ", subject)
        if (!subject) return null;
        if (isRight) {
            console.log("User was right.")
            //change their msg to confidence 2
            const teachingRes = await getTeachingResponse([{ role: "user", content: content } as any]);
            console.log("Teaching response: ", teachingRes)
            if (!teachingRes) return null;
            try {
                reply = {
                    eliResponseType: "General",
                    content: teachingRes.content,
                    role: "eli",
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

        //optional 1-1 relations are not yet available via mongodb and prisma. This is a workaround
        const lesson = await prisma.$transaction(async (tx) => {
            //we MUST save on lesson creation as the redirect to /lesson/lid fetches the lesson by id
            const note = await tx.note.create({
                data: {
                    content: "",
                }
            });
            const less = await tx.lesson.create({
                data: {
                    userId: userID,
                    stage: data.mode == "New Question" || isRight ? "main" : "purgatory",
                    subject: subject,
                    noteId: note.id,
                    targetQId: randomBytes(12).toString('hex')
                },
            });
            let kp = undefined;
            if (isRight) {
                kp = await tx.knowledgePoint.create({
                    data: {
                        confidence: reply.KP?.confidence!,
                        KP: reply.KP?.KP!,
                        TwoDvK: reply.KP?.TwoDvK!,
                        lessonId: less.id,
                        source: "reinforced",
                        userId: userID,
                    }
                });
            }
            const createdUserMsg = await tx.message.create(
                {
                    data: {
                        role: "user",
                        content: content,
                        KPId: randomBytes(12).toString('hex'),
                        lessonId: less.id,
                        metadataId: randomBytes(12).toString('hex'),
                    }
                });
            const createdEliReply = await tx.message.create({
                data: {
                    content: reply.content,
                    eliResponseType: reply.eliResponseType,
                    role: "eli",
                    KPId: isRight ? kp?.id : randomBytes(12).toString('hex'),
                    lessonId: less.id,
                    metadataId: randomBytes(12).toString('hex'),
                }
            });
            //random byte method instead
            // const met = await tx.metadata.create({
            //     data: {
            //         imageURL: "",
            //         references: [],
            //     }
            // });
            //update the lesson with the created msgs
            await tx.lesson.update({
                where: {
                    id: less.id
                },
                data: {
                    messages: {
                        connect: [
                            { id: createdUserMsg.id },
                            { id: createdEliReply.id }
                        ]
                    }
                }
            })

            return less;
            //if wasRight save their msg as confidence 2
        });

        console.log("Lesson created: ", lesson)
        return lesson;
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

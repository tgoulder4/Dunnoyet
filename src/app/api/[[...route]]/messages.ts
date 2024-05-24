import { experiencePerKnowledgePoint } from './../../../lib/chat/Eli/helpers/constants';

import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod';
import { lessonStatePayloadSchema, messagesPayloadSchema, messagesReceiveSchema } from '@/lib/validation/transfer/transferSchemas';
import { checkIsUserRight } from '@/lib/chat/Eli/helpers/correctness';
import { getTeachingResponse } from '@/lib/chat/Eli/core/core';
import { connect } from 'http2';
import { create } from 'domain';
import { oopsThatsNotQuiteRight } from '@/lib/chat/Eli/helpers/sayings';
import { messagesSchema } from '@/lib/validation/primitives';

const prisma = prismaClient;
export const runtime = 'edge';
const app = new Hono()
    .post('/response', async (c) => {
        const body = await c.req.json();
        console.log("Body: ", body)
        const parseResult = await messagesReceiveSchema.safeParseAsync(body);
        if (!parseResult.success) {
            console.error("Failed to parse messagesReceiveSchema: ", parseResult.error)
            return c.status(500)
        }
        const { stage, msgHistory, targetQuestion, lastSaved, subject, lessonId, userId, action } = parseResult.data;
        if (!msgHistory || !stage || !lessonId || !userId || !lastSaved) {
            console.error("Missing info in GET /api/messages. stage: ", stage, " lessonId: ", lessonId, " userId: ", userId, " lastSaved: ", lastSaved)
            return c.status(500)
        }
        //define the payload to be sent back
        console.log("PARSE PASSED");
        let payload: z.infer<typeof messagesPayloadSchema> = {
            newMessages: [],
            stage,
            lastSaved: new Date(),
        }
        const isRight = await checkIsUserRight(msgHistory);
        console.log("isRight: ", isRight)
        //if right save KP to db and pinecone, stage is now main
        //free roam:
        if (stage === 'purgatory') {
            //check their reply is right,
            if (isRight) {
                payload.stage = 'main';
                console.log("Payload stage is now main")
                const eliReply = await getTeachingResponse(msgHistory, [], targetQuestion, subject)
                console.log("Teaching response receieved: ", eliReply)
                if (!eliReply) {
                    console.error("Failed to get teaching response")
                    return c.status(500)
                };
                //client needs to change confidence of last message
                payload.newMessages!.push({
                    ...eliReply,
                    eliResponseType: "General"
                });

                payload.lastSaved = new Date();
            } else {
                //don't save
                payload.newMessages?.push({
                    role: 'eli',
                    eliResponseType: 'General',
                    content: oopsThatsNotQuiteRight(),
                })
            }
            //if wrong, ask them to try again
        }
        else if (stage === 'main') {
            //could be free roam/newq
            const msgHistoryToUseToGetResponse = action == "reply" ? msgHistory : [...msgHistory, {
                role: 'user' as "user" | "eli",
                content: "I understand!"
            }]
            const eliReply = await getTeachingResponse(msgHistoryToUseToGetResponse, [], targetQuestion, subject)
            if (!eliReply) {
                console.error("Failed to get teaching response")
                return c.status(500)
            };
            //doesn't matter if it's understood or reply, you'll be dealing with understood client side
            payload.newMessages!.push({
                ...eliReply,
                eliResponseType: eliReply.content.includes("?") ? "WhatComesToMind" : "General"
            });
        }
        else if (stage === 'end') {
            //save kps to user kp list
            await prisma.$transaction(async (tx) => {
                const savedKPs = await tx.knowledgePoint.createMany({
                    data: msgHistory.map(msg => ({
                        confidence: 2,
                        KP: msg.content,
                        lessonId,
                        userId,
                        source: "offered"
                    }))
                })
                if (!savedKPs) {
                    console.error("Failed to save KPs to user")
                    return c.status(500)
                }
                //update user experience

                const updatedUser = await tx.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        experience: {
                            increment: experiencePerKnowledgePoint * savedKPs.count
                        }
                    }
                })
                payload.experiencePrior = updatedUser.experience - experiencePerKnowledgePoint * savedKPs.count;
                return payload;
            })

        }
        console.log("Preparing payload: ", payload)
        //if last saved is greater than 5 mins & stage!==purg, save messagehistory to db
        if (payload.stage !== 'purgatory' && lastSaved && new Date().getTime() - lastSaved.getTime() > 300000) {
            //save all messages to db
            console.log("Skipping save")
            // console.log("Time to save messages to db as not saved in 5 mins")
            // const savedMessages = await prisma.message.createMany({
            //     data: msgHistory.map(msg => ({
            //         role: msg.role,
            //         content: msg.content,
            //         eliResponseType: msg.eliResponseType,
            //         lessonId,
            //     }))
            // })
            // console.log("Saved messages: ", savedMessages)
        }
        console.log("Returning payload: ", payload)
        return c.json({
            payload
        } as { payload: z.infer<typeof messagesPayloadSchema> })
    })
export default app;
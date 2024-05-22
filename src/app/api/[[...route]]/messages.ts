
import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod';
import { lessonStatePayloadSchema, messagesPayloadSchema, messagesReceiveSchema } from '@/lib/validation/transfer/transferSchemas';
import { checkIsUserRight } from '@/lib/chat/Eli/helpers/correctness';

const prisma = prismaClient;
export const runtime = 'edge';
const purgPayload = z.object({});
const app = new Hono()
    .get('/', zValidator('form',
        messagesReceiveSchema
    ), async (c) => {
        const { stage, msgHistory, targetQuestion } = c.req.valid('form');
        let payload: z.infer<typeof messagesPayloadSchema> = {
            newMessages: [],
            stage: 'purgatory',
            lastSaved: new Date(),
        }
        if (stage === 'purgatory') {
            if (!msgHistory) {
                console.error("No message history in GET /api/messages purgatory stage")
                return c.status(400)
            };

            //check their reply is right,
            const isRight = checkIsUserRight
            //if right save KP to db and pinecone, stage is now main
            //if wrong, ask them to try again

        }
        else if (stage === 'main') { }
        else if (stage === 'end') { }
        return c.json({
            payload: {} as typeof messagesPayloadSchema
        })
    })
export default app;
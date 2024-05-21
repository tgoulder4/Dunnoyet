
import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod';
import { messagesPayloadSchema, messagesReceiveSchema } from '@/lib/validation/transfer/transferSchemas';

const prisma = prismaClient;
export const runtime = 'edge';
const purgPayload = z.object({});
const app = new Hono()
    .get('/', zValidator('form',
        messagesReceiveSchema
    ), async (c) => {
        const {
            stage,
            purgDetails,
            mainDetails
        } = c.req.valid('form');
        if (stage === 'purgatory') {
            if (!purgDetails) return c.status(400);
            const { mode } = purgDetails;
            //check their reply is right,
            //if right save KP to db and pinecone, stage is now main
            //if wrong, ask them to try again

            if (!mode) { }
        }
        else if (stage === 'main') { }
        else if (stage === 'end') { }
        return c.json({
            payload: {} as typeof messagesPayloadSchema
        })
    })
export default app;
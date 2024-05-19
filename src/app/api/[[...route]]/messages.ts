
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
            let payload = {};
            if (!purgDetails) return c.status(400);
            const { mode } = purgDetails;


            if (!mode) { }
        }
        else if (stage === 'main') { }
        else if (stage === 'end') { }
        return c.json({
            payload: {} as typeof messagesPayloadSchema
        })
    })
export default app;
import { getTeachingResponse } from '@/lib/chat/Eli/core/core';
import prisma from '@/lib/db/prisma';
import { messagesSchema } from '@/lib/validation/primitives';
import { Hono } from 'hono';
import { z } from 'zod';
const msgHistory: z.infer<typeof messagesSchema>[] = [
    {
        role: "user",
        content: "What do you know already?",
    },
    {
        role: "user",
        content: "I think it's because they have the same charge.",
    },

]
const app = new Hono()
    .get('/', async (c) => {
        //fn to test
        const resp = getTeachingResponse(msgHistory, [], "Why do electrons repel each other?")
        if (!resp) return c.status(500)
        return c.json(resp)
    })

export default app;
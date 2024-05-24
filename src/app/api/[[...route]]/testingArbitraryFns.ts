import prisma from '@/lib/db/prisma';
import { Hono } from 'hono';
const msgHistory = [
    {
        "role": "user",
        "content": "The spinal cavity doesn't hold the spinal cord"
    },
    {
        "role": "eli",
        "content": "That wasn't quite right. What's a different fact you've got?",
        "eliResponseType": "WhatComesToMind"
    },
    {
        "role": "user",
        "content": "The spinal cavity does hold the spinal cord"
    }
]
const app = new Hono()
    .get('/', async (c) => {
        //fn to test
        const savedMessages = await prisma.message.createMany({
            data: msgHistory.map(msg => ({
                role: msg.role as "user" | "eli",
                content: msg.content,
                eliResponseType: msg.eliResponseType as "General" | "WhatComesToMind" | "System" | null,
                lessonId: "664d4836077166bfa43819f6",
            }))
        })
        return c.json(savedMessages)
    })

export default app;
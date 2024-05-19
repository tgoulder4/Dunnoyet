
import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
const prisma = prismaClient;
export const runtime = 'edge';

const app = new Hono()
    .get('/', async (c) => {
        const lesson = await prisma.lesson.findMany()
        return c.json({
            lesson: 'lesson'
        })
    })
export default app;
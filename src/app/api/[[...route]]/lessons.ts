
import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod';
import { getLoggedInUser, getUser } from '@/auth';
const prisma = prismaClient;
export const runtime = 'edge';
const app = new Hono()
    .post('/new', async (c) => {
        const user = await getLoggedInUser();
        if (!user) return c.status(401);
        //check if it's right then make stage purg or main
        const lesson = await prisma.lesson.create({
            data: {
                userId: user.id,
            }
        });
        return c.redirect(`/lesson/${lesson.id}/loading`)
    })


export default app;

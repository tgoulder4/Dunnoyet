
'use server'
import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
import { getLoggedInUser } from './auth';
const prisma = prismaClient;
export const runtime = 'edge';
export const getLesson = async (id: string) => {
    const lessonFound = prisma.lesson.findUnique({
        where: { id },
        select: {
            stage: true,
            targetQ: true,
            beganAt: true,
            endedAt: true,
            userId: true,
        }
    })
    return lessonFound;
}
const app = new Hono()
    .post('/new', async (c) => {
        const user = await getLoggedInUser();
        if (!user || !user.id) return c.status(401);
        //check if it's right then make stage purg or main
        const lesson = await prisma.lesson.create({
            data: {
                userId: user.id,
            }
        });
        return c.redirect(`/lesson/${lesson.id}/loading`)
    })
    .get('/:id', async (c) => {
        const id = c.req.param('id');
        const lesson = await getLesson(id);
        if (!lesson) return c.status(404);
        return c.json(lesson)
    })


export default app;

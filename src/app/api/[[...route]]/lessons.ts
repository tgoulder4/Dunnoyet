import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
import { getLoggedInUser } from './auth';
import { User } from 'next-auth';
const prisma = prismaClient;
export const runtime = 'edge';
export const getLesson = async (id: string) => {
    console.log("getLesson called with id: ", id)
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
export const createLesson = async (userID: string) => {
    console.log("createLesson called")
    if (!userID) {
        console.error("No user logged in @createLesson")
        return null
    };
    const lesson = await prisma.lesson.create({
        data: {
            userId: userID,
        }
    });
    return lesson;
}
const app = new Hono()
    .post('/new', async (c) => {
        const user = await getLoggedInUser();
        if (!user || !user.id) return c.status(401);
        const lesson = await createLesson(user.id);
        if (!lesson) return c.status(500);
        return c.redirect(`/lesson/${lesson.id}/loading`)
    })
    .get('/:id', async (c) => {
        const id = c.req.param('id');
        const lesson = await getLesson(id);
        if (!lesson) return c.status(404);
        return c.json(lesson)
    })


export default app;

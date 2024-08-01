// import getServerSession from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { Hono } from 'hono'

const app = new Hono()
    .post('/drop/all', async (c) => {
        // const sess = await getServerSession(authConfig).auth();
        // if (!sess || !sess.user || sess.user.role !== 'ADMIN') return c.status(401);
        // const userID = sess.user?.id;
        // if (!userID) return c.json({ success: false }, 401)
        try {
            await prisma.metadata.deleteMany();
            await prisma.message.deleteMany();
            await prisma.knowledgePoint.deleteMany();
            await prisma.lesson.deleteMany({});
            await prisma.targetQ.deleteMany();
            console.log("Dropped all tables")
            return c.json({ success: true }, 200)
        }
        catch (e) {
            console.error(e)
            return c.json({ success: false }, 500)
        }
    });
export default app;
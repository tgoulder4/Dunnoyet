import getServerSession from 'next-auth';
import { authConfig } from '@/auth.config';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { Hono } from 'hono'

const app = new Hono()
    .post('/drop/all', async (c) => {
        const sess = await getServerSession(authConfig).auth();
        if (!sess || !sess.user || sess.user.role !== 'ADMIN') return c.status(401);
        const userID = sess.user?.id;
        if (!userID) return c.status(401)
        try {
            await prisma.knowledgePoint.deleteMany();
            await prisma.message.deleteMany();
            await prisma.lesson.deleteMany({});
            await prisma.metadata.deleteMany();
            await prisma.targetQ.deleteMany();
            console.log("Dropped all tables")
            return c.status(200);
        }
        catch (e) {
            console.error(e)
            return c.status(500);
        }
    });
export default app;
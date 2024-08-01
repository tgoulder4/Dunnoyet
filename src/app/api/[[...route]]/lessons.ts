
import { createLessonSchema } from './../../../lib/validation/transfer/transferSchemas';
import { prismaClient } from '@/lib/db/prisma';
import { Hono } from 'hono'
import { z } from 'zod';
import { getTeachingResponse } from '@/lib/chat/Eli/core/core';
import { simplifyToKnowledgePointInSolitude, simplifyToSubject } from '@/lib/chat/Eli/helpers/simplify-message';
import { checkIsUserRight } from '@/lib/chat/Eli/helpers/correctness';
import { oopsThatsNotQuiteRight, tellMeWhatYouKnow } from '@/lib/chat/Eli/helpers/sayings';
import { messagesSchema } from '@/lib/validation/primitives';
import openai, { getEmbedding } from '@/lib/chat/openai';
import { getTwoDCoOrdinatesOfKPInSolitude } from '@/components/UserArea/Learn/Lesson/Network/utils/helpers';
import { randomBytes } from 'crypto';
import { createLesson } from '@/app/(userArea)/lesson/[lessonId]/actions';
const prisma = prismaClient;
export const runtime = 'edge';
const isProd = process.env.NODEENV === "production";

const app = new Hono()
    .get('/new', async (c) => {
        console.log("GET /api/lessons/new called")

        console.log("Request received: ", c.req.url)
        const mode = c.req.query("mode");
        if (mode !== "New Question" && mode !== "Free Roam") {
            console.log("Invalid mode, " + mode)
            return c.status(400)
        };
        const content = c.req.query("content");
        if (!mode || !content) {
            console.log("No mode or content")
            return c.status(400)
        };
        const lesson = await createLesson('65dbe7799c9c2a30ecbe6193', { mode, content });
        if (!lesson) return c.status(500);
        console.log("Returning lesson: ", lesson)
        return c.json(lesson)
    })
export default app;

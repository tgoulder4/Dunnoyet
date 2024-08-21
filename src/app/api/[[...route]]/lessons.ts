import { Hono } from 'hono'
import { createLesson } from '@/app/(userArea)/lesson/[lessonId]/actions';
export const runtime = 'edge';

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

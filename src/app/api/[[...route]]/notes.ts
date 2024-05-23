import prisma from "@/lib/db/prisma";
import { noteSchema } from "@/lib/validation/primitives";
import { Hono } from "hono";
import { z } from "zod";

export const getNotes = async (lessonID: string) => {
    console.log("getNotes called");
    const noteFound = await prisma.note.findFirst({
        where: {
            lesson: {
                id: lessonID
            }
        },
    });
    return noteFound;
}
export const patchNotes = async (lessonID: string, data: z.infer<typeof noteSchema>) => {
    console.log("patchNotes called");
    const note = await prisma.note.upsert({
        where: {
            id: data.id
        },
        update: {
            content: data.content
        },
        create: {
            content: data.content,
            lesson: {
                connect: {
                    id: lessonID
                }
            }
        }
    });
    return note;
}
const app = new Hono()
    .get("/:lessonID", async (c) => {
        const { lessonID } = c.req.param();
        const note = await getNotes(lessonID);
        if (!note) return c.status(500);
        return c.json(note);
    })
    .patch("/:lessonID", async (c) => {
        const { lessonID } = c.req.param();
        const note = await patchNotes(lessonID, await c.req.json());
        return c.json(note);
    })
export default app;
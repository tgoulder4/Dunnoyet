import { Hono } from 'hono';
import prisma from "@/lib/db/prisma";
export const getUser = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });
    return user;
}
const app = new Hono()
    .get("/:id", async (c) => {
        const { id } = c.req.param();
        const user = await getUser(id);
        if (!user) return c.status(404);
        return c.json(user);
    });

export default app;
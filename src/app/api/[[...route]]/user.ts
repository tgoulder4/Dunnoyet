import { Hono } from 'hono';
import prisma from "@/lib/db/prisma";
export const getUser = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        include: {
            lessons: {
                select: {
                    id: true
                }
            },
            knowledgePoints: true
        }
    });
    return user;
}
const checkDuplicateUser = async (username: string, email: string) => {
    const duplicateUserByUsername = await prisma.user.findUnique({
        where: {
            username
        }
    });
    if (duplicateUserByUsername) return 'username';
    const duplicateUserByEmail = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (duplicateUserByEmail) return 'email';
    return false;
}
export const createUser = async (formData: FormData) => {
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    if (!username || !password || !email) return c.status(400);
    const duplicateUser = await checkDuplicateUser(username, email);
    if (duplicateUser) return duplicateUser;
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password
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
    })
    .post("/new", async (c) => {
        const user = await createUser(await c.req.json());
        if (user === 'username') return c.status(409);
        if (user === 'email') return c.status(409);
        if (user === 400) return c.status(400);
        return c.json(user);
    });

export default app;
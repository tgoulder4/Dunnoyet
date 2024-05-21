
import prisma from '@/lib/db/prisma';
import { Hono } from 'hono'

export const runtime = 'edge';
export async function getReinforcedKnowledgePoints(userID: string) {
    try {
        const allReinforcedKPs = await prisma.knowledgePoint.findMany({
            where: {
                source: 'reinforced',
                userId: userID
            }
        })
        return allReinforcedKPs;
    } catch (e) {
        console.log(e)
        return null;
    }
}
const app = new Hono().get('/', (c) => {
    return c.json({
        message: 'KPs! Wooo',
    })
})
    .post('/new', async (c) => {
        return c.json({
            message: 'New KP!',
        })
    })


export default app;
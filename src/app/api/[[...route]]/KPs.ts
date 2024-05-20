
import { Hono } from 'hono'

export const runtime = 'edge';

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
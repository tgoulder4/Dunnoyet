
import { Hono } from 'hono'

export const runtime = 'edge';

const app = new Hono()

app.get('/', (c) => {
    return c.json({
        message: 'KPs! Wooo',
    })
})

export default app;
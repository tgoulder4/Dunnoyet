
import { Hono } from 'hono'

export const runtime = 'edge';

const app = new Hono()

app.get('/lessons', (c) => {
    return c.json({
        message: 'Hello Next.js!',
    })
})

export default app;
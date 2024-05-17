import { Hono } from 'hono'
import { authConfig } from '@/auth.config';
import NextAuth from 'next-auth';
import { auth } from '@/auth';
export const runtime = 'edge';

const app = new Hono().basePath('/api/auth')

app.get('/session', async (c) => {
    const session = await auth();
    return c.json(session)
})
app.get('/[...nextauth]', (c) => {
    const handler = NextAuth(authConfig);
    return c.json(handler)
})
app.post('/[...nextauth]', (c) => {
    const handler = NextAuth(authConfig);
    return c.json(handler)
})
export default app
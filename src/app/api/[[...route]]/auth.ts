import { Hono } from 'hono'
import { authConfig } from '@/auth.config';
import NextAuth from 'next-auth';
import { auth } from '@/auth';
import getServerSession from 'next-auth';
import { NextResponse } from 'next/server';
export const runtime = 'edge';

const app = new Hono()
// .basePath('/api/auth')
export async function getLoggedInUser() {
    const sess = await getServerSession(authConfig).auth();
    if (!sess || !sess.user) return null;
    const user = sess.user;
    if (!user.id) return null;
    return sess.user;
}

// app.get('/session', async (c) => {
//     const session = await auth();
//     return NextResponse.json(session)
// })

app.get('/[...nextauth]', (c) => {
    const handler = NextAuth(authConfig);
    return c.json(handler)
})
app.post('/[...nextauth]', (c) => {
    const handler = NextAuth(authConfig);
    return c.json(handler)
})
export default app
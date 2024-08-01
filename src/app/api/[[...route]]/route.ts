import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import messages from './messages'
import lessons from './lessons'
import auth from './auth'
import kps from './KPs'
import admin from './admin'
import notes from './notes'
import users from './user'
import test from './testingArbitraryFns'
// export const runtime = 'edge'; //there are issues with bcrypt and running on the edge
import { RateLimit } from '@rlimit/http';

const rlimit = new RateLimit({
    namespace: 'ddcddb0a-82da-4136-bec6-a49d2a8573cf',
    maximum: 10,
    interval: '1m'
});

const app = new Hono().basePath('/api');
const rateLimitMiddleware = async (c: any, next: any) => {
    // use x-forwarded-for or x-real-ip if available
    const identifier =
        c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "anon";

    // check if the request is within the limit
    const limit = await rlimit.check(identifier);
    console.info(limit);

    if (!limit.ok) {
        return c.text("too many requests", 429);
    }

    await next();
};

app.use(rateLimitMiddleware);
app
    .route('/messages', messages)
    .route('/lessons', lessons)
    .route('/kps', kps)
    .route('/auth', auth)
    .route('/admin', admin)
    .route('/notes', notes)
    .route('/users', users)
    .route("/test", test)
// app.route('/admin', admin)

export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof app;
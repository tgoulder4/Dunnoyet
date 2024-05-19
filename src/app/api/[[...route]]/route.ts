import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import lessons from './lessons'
import auth from './auth'
import kps from './KPs'
// export const runtime = 'edge'; //there are issues with bcrypt and running on the edge
const app = new Hono().basePath('/api');
const routes = app.route('/lessons', lessons);
app.route('/kps', kps)
app.route('/auth', auth)

export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof routes;
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import lessons from './lessons'
import auth from './auth'
import kps from './KPs'
export const runtime = 'edge';
const app = new Hono();
app.route('/api/lessons', lessons)
app.route('/api/kps', kps)
// app.route('/auth', auth)

export const GET = handle(app)
export const POST = handle(app)
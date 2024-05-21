import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import messages from './messages'
import lessons from './lessons'
import auth from './auth'
import kps from './KPs'
import admin from './admin'
// export const runtime = 'edge'; //there are issues with bcrypt and running on the edge
const app = new Hono().basePath('/api')
    .route('/messages', messages)
    .route('/lessons', lessons)
    .route('/kps', kps)
    .route('/auth', auth)
// const adminRoute = app.route('/admin', admin)
// app.route('/admin', admin)

export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof app;
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
const app = new Hono().basePath('/api')
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
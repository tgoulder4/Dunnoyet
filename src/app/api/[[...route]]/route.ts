import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import messages from './messages'
import lessons from './lessons'
import auth from './auth'
import kps from './KPs'
import admin from './admin'
// export const runtime = 'edge'; //there are issues with bcrypt and running on the edge
const app = new Hono().basePath('/api');
const msgRoute = app.route('/messages', messages);
const lessonRoute = app.route('/lessons', lessons)
const kpsRoute = app.route('/kps', kps)
const authRoute = app.route('/auth', auth)
// const adminRoute = app.route('/admin', admin)
const routes = {
    msgRoute,
    lessonRoute,
    kpsRoute,
    authRoute,
    // adminRoute
}
// app.route('/admin', admin)

export const GET = handle(app)
export const POST = handle(app)
export type AppTypes = typeof routes;
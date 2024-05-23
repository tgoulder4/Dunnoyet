import { Hono } from 'hono';
const app = new Hono()
    .get('/', async (c) => {
        //fn to test
    })

export default app;
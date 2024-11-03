import { Elysia } from 'elysia';
import { log } from 'console';
import cors from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { swagger } from '@elysiajs/swagger'
import apiRoute from "./routes"

const port = process.env.API_PORT

if (!port) {
    throw new Error("error not port env");
}

const app = new Elysia()
    .use(swagger())
    .use(cors())
    .use(staticPlugin({
        assets: 'public',
        prefix: '/'
    }))
    .get('/test', () => ({ text: 'test' }))
    .group("/api", (app) => app.use(apiRoute))
    .onError(({ code, error, set }) => {
        log(`Error ${code}: ${error.message}`);
        set.status = code === 'NOT_FOUND' ? 404 : 500;
        return {
            success: false,
            message: code === 'NOT_FOUND' ? 'Not Found' : 'Internal Server Error',
            error: process.env.NODE_ENV === 'production' ? null : error.message
        };
    })
    .listen(port, () => {
        log(`🦊 Elysia is running at http://localhost:${port}`);
    });

export default app;
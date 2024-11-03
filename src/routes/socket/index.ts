import Elysia from "elysia";
import Notifications from "./notifications"

const app = new Elysia()
    .use(Notifications)

export default app;
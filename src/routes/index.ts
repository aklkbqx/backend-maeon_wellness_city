import Elysia from "elysia";
import User from "./user";
import Auth from "./auth";
import Programs from "./programs";
import Booking from "./booking";
import Payment from "./payments";
import NavigateMap from "./navigate-map";
import Locations from "./locations";
import Subdistricts from "./subdistricts";
import Notifications from "./notifications";
import Search from "./search";
import Socket from "./socket"
import { getThaiDate } from "../../lib/lib";
import CheckVersion from "./check-version"
import Admin from "./admin"


const app = new Elysia()
    .get("/datetime", getThaiDate())
    .use(CheckVersion)
    .group("/auth", app => app.use(Auth))
    .group("/users", app => app.use(User))
    .group("/programs", app => app.use(Programs))
    .group("/bookings", app => app.use(Booking))
    .group("/payments", app => app.use(Payment))
    .group("/locations", app => app.use(Locations))
    .group("/subdistricts", app => app.use(Subdistricts))
    .group("/notifications", app => app.use(Notifications))
    .group("/navigate-map", app => app.use(NavigateMap))
    .group("/search", app => app.use(Search))
    .group("/ws", app => app.use(Socket))
    .group("/admin", app => app.use(Admin))

export default app;
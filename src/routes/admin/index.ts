import Elysia from "elysia"
import BookingAndPayment from "./booking-payment"
import Locations from "./locations"

const app = new Elysia()
    .group("/booking-payment", app => app.use(BookingAndPayment))
    .group("/locations", app => app.use(Locations))

export default app
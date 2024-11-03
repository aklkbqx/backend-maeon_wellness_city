import Elysia from "elysia"
import BookingAndPayment from "./booking-payment"

const app = new Elysia()
    .group("/booking-payment", app => app.use(BookingAndPayment))

export default app
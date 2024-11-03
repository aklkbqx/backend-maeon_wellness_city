import Elysia, { t } from "elysia";
import { PrismaClient } from "@prisma/client"

export interface LocationWithStatus {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    scheduledTime: string;
    type: string;
    isComplete: boolean;
}

const prisma = new PrismaClient();

const app = new Elysia()
    .get("/:booking_id", async ({ params: { booking_id } }) => {
        try {
            const booking = await prisma.bookings.findUnique({
                where: { id: parseInt(booking_id) },
                include: {
                    users: true
                }
            });

            if (!booking) {
                return { success: false, message: "ไม่พบข้อมูลการจอง" };
            }

            const bookingDetails = JSON.parse(booking.booking_details);
            const destinations: LocationWithStatus[] = [];

            for (const program of bookingDetails) {
                const schedules = typeof program.schedules === 'string'
                    ? JSON.parse(program.schedules)
                    : program.schedules;

                for (const schedule of schedules) {
                    for (const activity of schedule.activities) {
                        if (activity.location_id) {
                            const location = await prisma.locations.findUnique({
                                where: { id: activity.location_id }
                            });

                            if (location) {
                                const locationMap = JSON.parse(location.map || '{}');
                                destinations.push({
                                    id: location.id,
                                    name: activity.location_name,
                                    latitude: parseFloat(locationMap.latitude),
                                    longitude: parseFloat(locationMap.longitude),
                                    scheduledTime: activity.start_time,
                                    type: activity.location_type,
                                    isComplete: activity.isComplete || false
                                });
                            }
                        }
                    }
                }
            }

            return {
                success: true,
                data: destinations
            };
        } catch (error) {
            console.error(error);
            return { success: false, message: String(error) };
        }
    })
    .post("/:booking_id/complete", async ({ params: { booking_id }, body }) => {
        try {
            const booking = await prisma.bookings.findUnique({
                where: { id: parseInt(booking_id) }
            });

            if (!booking) {
                return { success: false, message: "ไม่พบข้อมูลการจอง" };
            }

            const bookingDetails = JSON.parse(booking.booking_details);
            let updated = false;

            for (const program of bookingDetails) {
                const schedules = typeof program.schedules === 'string'
                    ? JSON.parse(program.schedules)
                    : program.schedules;

                for (const schedule of schedules) {
                    for (const activity of schedule.activities) {
                        if (activity.location_id === body.locationId) {
                            activity.isComplete = true;
                            updated = true;
                        }
                    }
                }
                program.schedules = JSON.stringify(schedules);
            }

            if (updated) {
                await prisma.bookings.update({
                    where: { id: parseInt(booking_id) },
                    data: {
                        booking_details: JSON.stringify(bookingDetails)
                    }
                });
            }

            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: String(error) };
        }
    }, {
        body: t.Object({
            locationId: t.Number()
        })
    });

export default app;
import { Elysia, t } from 'elysia';
import { PrismaClient, bookings_status, notifications_type, payments_status, users_role } from '@prisma/client';
import { jwt } from '@elysiajs/jwt';
import { getThaiDate, JWTPayloadUser, sendNotification } from '../../lib/lib';

// Updated interfaces to include completion status
export interface BookingItem {
    people: number;
    start_date: string;
    end_date: string;
    booking_detail: {
        program_id: number;
        date: string;
    }[]
}

interface Activity {
    sequence: number;
    start_time: string;
    end_time: string;
    activity: string;
    description: string;
    location_id: number;
    location_name: string;
    location_type: string;
    cost: number;
    included_in_total_price: boolean;
    is_mandatory?: boolean;
    services?: string[];
    locations?: Array<{
        id: number;
        name: string;
        type: string;
    }>;
    note?: string;
    isComplete?: boolean;
}

interface Schedule {
    day: number;
    title: string;
    activities: Activity[];
}

interface ProgramData {
    program_id: number;
    program_name: string;
    date: string;
    schedules: string | Schedule[];
}

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined.');
}

const app = new Elysia()
    .get("/receipts/public/:bookingId", async ({ params: { bookingId }, set }) => {
        try {
            const bookingIdNum = parseInt(bookingId);

            if (isNaN(bookingIdNum)) {
                set.status = 400;
                return {
                    success: false,
                    message: "รหัสการจองไม่ถูกต้อง"
                };
            }

            const booking = await prisma.bookings.findFirst({
                where: {
                    id: bookingIdNum,
                    AND: {
                        status: {
                            not: bookings_status.CANCELLED
                        }
                    }
                },
                include: {
                    users: {
                        select: {
                            firstname: true,
                            lastname: true,
                        }
                    },
                    payments: {
                        where: {
                            status: {
                                in: [payments_status.PAID, payments_status.PENDING]
                            }
                        },
                        select: {
                            id: true,
                            payment_date: true,
                            status: true,
                            transaction_id: true
                        },
                    }
                }
            });

            if (!booking) {
                set.status = 404;
                return {
                    success: false,
                    message: "ไม่พบข้อมูลการจอง"
                };
            }

            const payment = booking.payments;

            return {
                success: true,
                data: {
                    id: booking.id,
                    booking_date: booking.booking_date,
                    start_date: booking.start_date,
                    end_date: booking.end_date,
                    people: booking.people,
                    total_price: booking.total_price.toString(),
                    status: booking.status,
                    booking_details: JSON.parse(booking.booking_details),
                    user: {
                        firstname: booking.users.firstname,
                        lastname: booking.users.lastname
                    },
                    payment: {
                        id: payment?.id,
                        payment_date: payment?.payment_date,
                        status: payment?.status,
                        transaction_id: payment?.transaction_id
                    }
                }
            };

        } catch (error) {
            console.error('Error fetching public booking:', error);
            set.status = 500;
            return {
                success: false,
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: error instanceof Error ? error.message : String(error)
            };
        }
    })
    .use(jwt({ name: 'jwt', secret: SECRET_KEY }))
    .derive(async ({ headers, jwt, set }) => {
        const authHeader = headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            set.status = 401;
            return { success: false, message: "ไม่พบ Token การยืนยันตัวตน" };
        }
        const token = authHeader.split(' ')[1];
        const payloadUser = await jwt.verify(token) as JWTPayloadUser;
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }
        const existingUser = await prisma.users.findUnique({
            where: { id: payloadUser.id },
        });

        if (!existingUser) {
            set.status = 404;
            return {
                success: false,
                message: "ไม่พบข้อมูลผู้ใช้",
            };
        }
        return { payloadUser, existingUser }
    })
    .get("/", async ({ set, payloadUser }) => {
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }
        try {
            const bookings = await prisma.bookings.findMany({
                where: {
                    user_id: payloadUser.id
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            if (!bookings || bookings.length === 0) {
                return {
                    success: true,
                    message: "ไม่มีข้อมูลการจองของคุณ",
                    bookings: []
                };
            }

            return {
                success: true,
                bookings: bookings.map(booking => ({
                    ...booking,
                    booking_details: JSON.parse(booking.booking_details),
                    total_price: booking.total_price.toString()
                }))
            };
        } catch (error) {
            console.error("Error fetching bookings:", error);
            set.status = 500;
            return {
                success: false,
                message: "เกิดข้อผิดพลาดขณะดึงข้อมูลรายละเอียดการจองทั้งหมดของคุณ",
                error: error instanceof Error ? error.message : String(error)
            };
        }
    })
    .post("/start-booking", async ({ headers, body, set, payloadUser }) => {
        const authHeader = headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            set.status = 401;
            return { success: false, message: "ไม่พบ Token การยืนยันตัวตน" };
        }
        const token = authHeader.split(' ')[1];
        try {
            const { people, start_date, end_date, booking_detail } = body as BookingItem;
            if (!payloadUser) {
                set.status = 401;
                return { success: false, message: "token ไม่ถูกต้อง" };
            }

            const user = await prisma.users.findUnique({
                where: {
                    id: payloadUser.id
                }
            })

            let total_price = 0;
            const programsData: ProgramData[] = [];

            for (const detail of booking_detail) {
                const program = await prisma.programs.findUnique({
                    where: { id: detail.program_id },
                    select: {
                        id: true,
                        name: true,
                        total_price: true,
                        schedules: true,
                    }
                });

                if (!program) {
                    throw new Error(`ไม่พบโปรแกรมที่มี ID ${detail.program_id}`);
                }

                const schedules = typeof program.schedules === 'string'
                    ? JSON.parse(program.schedules)
                    : program.schedules;

                const updatedSchedules = schedules.map((schedule: Schedule) => ({
                    ...schedule,
                    activities: schedule.activities.map(activity => ({
                        ...activity,
                        isComplete: false
                    }))
                }));

                total_price += program.total_price.toNumber() * people;
                programsData.push({
                    program_id: program.id,
                    program_name: program.name,
                    date: detail.date,
                    schedules: JSON.stringify(updatedSchedules)
                });
            }

            const booking = await prisma.bookings.create({
                data: {
                    user_id: payloadUser.id,
                    booking_details: JSON.stringify(programsData),
                    booking_date: getThaiDate(),
                    start_date: getThaiDate(start_date),
                    end_date: getThaiDate(end_date),
                    people,
                    total_price,
                    status: bookings_status.PENDING
                }
            });

            await prisma.payments.create({
                data: {
                    booking_id: booking.id,
                    status: payments_status.PENDING,
                    transaction_id: `BOOKING-${booking.id}-${Date.now()}`,
                    payment_date: new Date(),
                }
            });

            await sendNotification(token, {
                type: notifications_type.SYSTEM,
                receive: {
                    userId: payloadUser.id,
                    all: false
                },
                title: "สร้างการจองสำเร็จแล้ว",
                body: "กรุณาดำเนินชำระเงินได้ที่นี่",
                data: {
                    link: {
                        pathname: "/user/payments",
                        params: {
                            bookingId: booking.id
                        }
                    }
                }
            });

            return {
                success: true,
                message: "สร้างการจองสำเร็จแล้ว",
                booking_id: booking.id
            };

        } catch (error) {
            console.error('Booking error:', error);
            set.status = 500;
            return {
                success: false,
                message: "เกิดข้อผิดพลาดขณะดำเนินการจอง",
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }, {
        body: t.Object({
            people: t.Number(),
            start_date: t.String(),
            end_date: t.String(),
            booking_detail: t.Array(
                t.Object({
                    program_id: t.Number(),
                    date: t.String(),
                })
            )
        })
    })
    .get("/my-booking/:bookingId", async ({ params: { bookingId }, set, payloadUser }) => {
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }
        try {
            if (isNaN(parseInt(bookingId))) {
                set.status = 400;
                return {
                    success: false,
                    message: "รหัสการจองไม่ถูกต้อง"
                };
            }

            const booking = await prisma.bookings.findUnique({
                where: { id: parseInt(bookingId), user_id: payloadUser.id }
            });

            if (!booking) {
                set.status = 404;
                return {
                    success: false,
                    message: "ไม่พบการจอง"
                };
            }

            const bookingDetails = JSON.parse(booking.booking_details);

            return {
                success: true,
                data: {
                    id: booking.id,
                    user_id: booking.user_id,
                    booking_details: bookingDetails,
                    booking_date: booking.booking_date,
                    start_date: booking.start_date,
                    end_date: booking.end_date,
                    people: booking.people,
                    total_price: booking.total_price,
                    status: booking.status,
                }
            };

        } catch (error) {
            set.status = 500;
            console.error(error);
            return {
                success: false,
                message: "เกิดข้อผิดพลาดขณะดึงข้อมูลรายละเอียดการจอง",
                error: error instanceof Error ? error.message : String(error)
            };
        }
    })
    .post("/my-booking/:bookingId/complete-activity", async ({ params: { bookingId }, body, set, payloadUser }) => {
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }

        try {
            const booking = await prisma.bookings.findUnique({
                where: {
                    id: parseInt(bookingId),
                    user_id: payloadUser.id
                }
            });

            if (!booking) {
                set.status = 404;
                return { success: false, message: "ไม่พบการจอง" };
            }

            const bookingDetails = JSON.parse(booking.booking_details);
            let updated = false;

            const updatedDetails = bookingDetails.map((program: ProgramData) => {
                const schedules = typeof program.schedules === 'string'
                    ? JSON.parse(program.schedules)
                    : program.schedules;

                const updatedSchedules = schedules.map((schedule: Schedule) => ({
                    ...schedule,
                    activities: schedule.activities.map((activity: Activity) => {
                        if (activity.location_id === body.locationId) {
                            updated = true;
                            return { ...activity, isComplete: true };
                        }
                        return activity;
                    })
                }));

                return {
                    ...program,
                    schedules: JSON.stringify(updatedSchedules)
                };
            });

            if (updated) {
                await prisma.bookings.update({
                    where: { id: parseInt(bookingId) },
                    data: {
                        booking_details: JSON.stringify(updatedDetails)
                    }
                });

                return {
                    success: true,
                    message: "อัพเดทสถานะกิจกรรมเรียบร้อยแล้ว"
                };
            }

            set.status = 400;
            return {
                success: false,
                message: "ไม่พบกิจกรรมที่ระบุ"
            };

        } catch (error) {
            set.status = 500;
            console.error(error);
            return {
                success: false,
                message: "เกิดข้อผิดพลาดในการอัพเดทสถานะกิจกรรม",
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }, {
        body: t.Object({
            locationId: t.Number()
        })
    });


export default app;
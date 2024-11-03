import { Elysia, t } from 'elysia';
import { notifications_type, payments_status, PrismaClient } from '@prisma/client';
import jwt from '@elysiajs/jwt';

const prisma = new PrismaClient()
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined.');
}

const adminNotificationRoutes = new Elysia()
    .use(jwt({ name: 'jwt', secret: SECRET_KEY }))
    // .derive(async ({ headers, jwt, set }) => {
    //     const authHeader = headers.authorization;
    //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //         set.status = 401;
    //         return { success: false, message: "ไม่พบ Token การยืนยันตัวตน" };
    //     }
    //     const token = authHeader.split(' ')[1];
    //     const payloadUser = await jwt.verify(token) as JWTPayloadUser;
    //     if (!payloadUser || payloadUser.role !== 'admin') {
    //         set.status = 401;
    //         return { success: false, message: "ไม่มีสิทธิ์เข้าถึง" };
    //     }
    //     const existingUser = await prisma.users.findUnique({
    //         where: { id: payloadUser.id },
    //     });
    //     if (!existingUser || existingUser.role !== 'admin') {
    //         set.status = 404;
    //         return { success: false, message: "ไม่มีสิทธิ์เข้าถึง" };
    //     }
    //     return { payloadUser, existingUser }
    // })
    .get('/all', async ({ set }) => {
        try {
            const allBooking = await prisma.bookings.findMany({
                orderBy: [
                    { status: 'asc' },
                    { created_at: 'desc' }
                ],
                include: {
                    users: {
                        select: {
                            firstname: true,
                            lastname: true,
                            email: true,
                            tel: true
                        }
                    }
                }
            })
            return {
                success: true,
                allBooking
            }
        } catch (error) {
            return {
                success: false,
                message: 'ไม่สามารถดึงข้อมูลการแจ้งเตือนได้',
            };
        }
    })
    // TODO เขียน api สำหรับการยืนยันการชำระเงินในกรณีที api openverify ใช้งานไม่ได้
    .put('/verify-payment/:bookingId', async ({ params: { bookingId }, body, set }) => {
        const { status } = body as { status: payments_status };
        try {
            const payment = await prisma.payments.findUnique({
                where: { booking_id: Number(bookingId) },
                include: { bookings: true }
            });

            if (!payment) {
                set.status = 404;
                return {
                    success: false,
                    message: 'ไม่พบข้อมูลการชำระเงิน'
                };
            }

            console.log(payment);
            // await prisma.$transaction(async (tx) => {
            //     await tx.payments.update({
            //         where: { id: Number(paymentId) },
            //         data: { status }
            //     });

            //     await tx.notifications.create({
            //         data: {
            //             type: 'PAYMENT',
            //             title: status === 'PAID' ? 'ยืนยันการชำระเงิน' : 'ปฏิเสธการชำระเงิน',
            //             body: status === 'PAID'
            //                 ? 'การชำระเงินของคุณได้รับการยืนยันแล้ว'
            //                 : 'การชำระเงินของคุณถูกปฏิเสธ กรุณาตรวจสอบและทำรายการใหม่',
            //             user_id: payment.bookings.user_id,
            //             data: JSON.stringify({
            //                 paymentId: payment.id,
            //                 bookingId: payment.booking_id,
            //                 status
            //             })
            //         }
            //     });

            //     // ถ้ายืนยันการชำระเงิน ให้อัพเดทสถานะการจอง
            //     if (status === 'PAID') {
            //         await tx.bookings.update({
            //             where: { id: payment.booking_id },
            //             data: { status: 'CONFIRMED' }
            //         });
            //     }
            // });

            // return {
            //     success: true,
            //     message: status === 'PAID'
            //         ? 'ยืนยันการชำระเงินเรียบร้อย'
            //         : 'ปฏิเสธการชำระเงินเรียบร้อย'
            // };
        } catch (error) {
            set.status = 500;
            return {
                success: false,
                message: 'ไม่สามารถอัพเดทสถานะการชำระเงินได้'
            };
        }
    }, {
        body: t.Object({
            status: t.Enum(payments_status)
        })
    })
    .put('/confirm-booking/:id', async ({ params: { id }, set }) => {
        try {
            const booking = await prisma.bookings.findUnique({
                where: { id: Number(id) }
            });

            if (!booking) {
                set.status = 404;
                return {
                    success: false,
                    message: 'ไม่พบข้อมูลการจอง'
                };
            }

            // await prisma.$transaction(async (tx) => {
            //     // อัพเดทสถานะการจอง
            //     await tx.bookings.update({
            //         where: { id: Number(id) },
            //         data: { status: 'CONFIRMED' }
            //     });

            //     // สร้างการแจ้งเตือนให้ผู้ใช้
            //     await tx.notifications.create({
            //         data: {
            //             type: 'ORDER',
            //             title: 'ยืนยันการจอง',
            //             body: 'การจองของคุณได้รับการยืนยันแล้ว',
            //             user_id: booking.user_id,
            //             data: JSON.stringify({
            //                 bookingId: booking.id,
            //                 status: 'CONFIRMED'
            //             })
            //         }
            //     });
            // });

            return {
                success: true,
                message: 'ยืนยันการจองเรียบร้อย'
            };
        } catch (error) {
            set.status = 500;
            return {
                success: false,
                message: 'ไม่สามารถยืนยันการจองได้'
            };
        }
    })
    .get('/unread-count', async ({ set }) => {
        try {
            const count = await prisma.notifications.count({
                where: {
                    OR: [
                        { type: 'PAYMENT', status: 'UNREAD' },
                        { type: 'ORDER', status: 'UNREAD' },
                        {
                            type: 'STATUS_UPDATE',
                            status: 'UNREAD',
                            data: { contains: '"requireAdminAction":true' }
                        }
                    ],
                    is_deleted: false,
                }
            });

            return {
                success: true,
                count
            };
        } catch (error) {
            return {
                success: false,
                message: 'ไม่สามารถนับจำนวนการแจ้งเตือนได้',
            };
        }
    });

export default adminNotificationRoutes;
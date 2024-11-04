import { Elysia, t } from 'elysia';
import { notifications_type, PrismaClient, users_role } from '@prisma/client';
import jwt from '@elysiajs/jwt';
import { JWTPayloadUser, sendNotification } from '../../lib/lib';
import cron from '@elysiajs/cron';

const prisma = new PrismaClient()
const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_JWT_ADMIN = process.env.TOKEN_JWT_ADMIN

if (!SECRET_KEY || !TOKEN_JWT_ADMIN) {
    throw new Error('KEY is not defined.');
}

const notificationRoutes = new Elysia()
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
    .get('/', async ({ payloadUser, set }) => {
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }
        try {
            const notifications = await prisma.notifications.findMany({
                where: {
                    user_id: payloadUser.id,
                    is_deleted: false,
                },
                orderBy: [
                    { created_at: 'desc' },
                    { status: 'asc' },
                ],
            });

            return {
                success: true,
                notifications,
            };
        } catch (error) {
            return {
                success: false,
                message: 'ไม่สามารถดึงข้อมูลการแจ้งเตือนได้',
            };
        }
    })
    .get('/unread-count', async ({ payloadUser, set }) => {
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }

        try {
            const count = await prisma.notifications.count({
                where: {
                    user_id: payloadUser.id,
                    status: 'UNREAD',
                    is_deleted: false,
                },
            });

            return {
                success: true,
                count,
            };
        } catch (error) {
            return {
                success: false,
                message: 'ไม่สามารถนับจำนวนการแจ้งเตือนที่ยังไม่ได้อ่านได้',
            };
        }
    })
    .put('/:id/read', async ({ params: { id }, payloadUser, set }) => {
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }
        try {
            const notification = await prisma.notifications.findFirst({
                where: {
                    id: Number(id),
                    user_id: payloadUser.id,
                    is_deleted: false,
                },
            });

            if (!notification) {
                set.status = 404;
                return { success: false, message: "ไม่พบการแจ้งเตือนนี้" };
            }

            const updatedNotification = await prisma.notifications.update({
                where: { id: Number(id) },
                data: {
                    status: 'READ',
                    updated_at: new Date(),
                },
            });

            return {
                success: true,
                notification: updatedNotification,
            };
        } catch (error) {
            return {
                success: false,
                message: error || "ไม่สามารถอัพเดทสถานะการแจ้งเตือนได้",
            };
        }
    })
    .delete('/:id', async ({ params: { id }, payloadUser, set }) => {
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }

        try {
            const notification = await prisma.notifications.findFirst({
                where: {
                    id: Number(id),
                    user_id: payloadUser.id,
                    is_deleted: false,
                },
            });

            if (!notification) {
                set.status = 404;
                return { success: false, message: "ไม่พบการแจ้งเตือนนี้" };
            }

            await prisma.notifications.update({
                where: { id: Number(id) },
                data: {
                    is_deleted: true,
                    updated_at: new Date(),
                },
            });

            return {
                success: true,
                message: 'ลบการแจ้งเตือนเรียบร้อยแล้ว',
            };
        } catch (error) {
            return {
                success: false,
                message: error || "ไม่สามารถลบการแจ้งเตือนได้",
            };
        }
    })
    .put('/read-all', async ({ payloadUser, set }) => {
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }

        try {
            await prisma.notifications.updateMany({
                where: {
                    user_id: payloadUser.id,
                    status: 'UNREAD',
                    is_deleted: false,
                },
                data: {
                    status: 'READ',
                    updated_at: new Date(),
                },
            });

            return {
                success: true,
                message: 'อ่านการแจ้งเตือนทั้งหมดแล้ว',
            };
        } catch (error) {
            return {
                success: false,
                message: 'ไม่สามารถอัพเดทสถานะการแจ้งเตือนได้',
            };
        }
    })
    .use(cron({
        name: 'cleanup-old-notifications',
        pattern: '0 0 * * *',
        run: async () => {
            try {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const deletedCount = await prisma.notifications.deleteMany({
                    where: {
                        is_deleted: true,
                        updated_at: {
                            lt: thirtyDaysAgo
                        }
                    }
                });

                await sendNotification(TOKEN_JWT_ADMIN, {
                    type: notifications_type.SYSTEM,
                    receive: {
                        all: false,
                        role: users_role.admin
                    },
                    title: "ทำความสะอาดตารางกล่องข้อความที่ถูกลบไปแล้ว",
                    body: `ทำความสะอาดข้อความจำนวน ${deletedCount.count} ข้อความ`,
                    // data: {
                        // link: {
                        //     pathname: "/user/payments",
                        //     params: {
                        //         bookingId: booking.id
                        //     }
                        // }
                    // }
                });
                console.log(`Cleaned up ${deletedCount.count} old notifications`);
            } catch (error) {
                console.error('Error cleaning up notifications:', error);
            }
        }
    }))
    .post('/cleanup', async ({ payloadUser, set }) => {
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }
        if (payloadUser.role !== 'ADMIN') {
            set.status = 403;
            return { success: false, message: "ไม่มีสิทธิ์ในการเข้าถึง" };
        }
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const deletedCount = await prisma.notifications.deleteMany({
                where: {
                    is_deleted: true,
                    updated_at: {
                        lt: thirtyDaysAgo
                    }
                }
            });

            return {
                success: true,
                message: `ลบการแจ้งเตือนที่เก่ากว่า 30 วันจำนวน ${deletedCount.count} รายการ`,
                deletedCount: deletedCount.count
            };
        } catch (error) {
            set.status = 500;
            return {
                success: false,
                message: 'ไม่สามารถลบการแจ้งเตือนได้',
                error: error
            };
        }
    })

export default notificationRoutes;
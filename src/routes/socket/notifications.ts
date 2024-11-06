import jwt from '@elysiajs/jwt'
import { Elysia, t } from 'elysia'
import { PrismaClient, notifications_status, users, users_role } from '@prisma/client';
import { JWTPayloadUser, NotificationData } from '../../../lib/lib';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error("Key and Secret Key undefined!");
}

interface WebSocketData {
    success: boolean;
    message?: string;
    payloadUser?: JWTPayloadUser;
    existingUser?: users;
}

const app = new Elysia()
    .use(jwt({ name: 'jwt', secret: SECRET_KEY }))
    .derive(async ({ query: { token }, jwt }) => {
        const payloadUser = await jwt.verify(token) as JWTPayloadUser;
        if (!payloadUser) {
            return { success: false, message: "การยืนยันตัวตนไม่ถูกต้อง" };
        }
        const existingUser = await prisma.users.findUnique({
            where: { id: payloadUser.id },
        });
        if (!existingUser) {
            return {
                success: false,
                message: "ไม่พบข้อมูลผู้ใช้",
            };
        }
        return { success: true, payloadUser, existingUser }
    })
    .ws('/notification', {
        query: t.Object({
            token: t.String()
        }),
        async open(ws) {
            const data = ws.data as WebSocketData;
            if (!data.success || !data.existingUser) {
                ws.send({
                    success: false,
                    message: data.message || "ไม่สามารถเชื่อมต่อได้"
                });
                ws.close();
                return;
            }
            ws.subscribe("notification");
        },
        async message(ws, message) {
            console.log(message)
            const wsData = ws.data as WebSocketData;
            if (!wsData.success || !wsData.existingUser) {
                ws.send(JSON.stringify({
                    success: false,
                    message: "ไม่มีสิทธิ์ในการส่งการแจ้งเตือน"
                }));
                return;
            }

            let messageObject: NotificationData;

            if (typeof message === "string") {
                try {
                    messageObject = JSON.parse(message) as NotificationData;
                } catch (error) {
                    ws.send(JSON.stringify({
                        success: false,
                        message: "Invalid message format"
                    }));
                    return;
                }
            } else if (typeof message === "object") {
                messageObject = message as NotificationData;
            } else {
                ws.send(JSON.stringify({
                    success: false,
                    message: "Unexpected message type"
                }));
                return;
            }

            try {
                if (!messageObject.dev) {
                    if (messageObject.receive.all) {
                        const userId = await prisma.users.findMany({
                            select: { id: true }
                        })
                        userId.map(async ({ id }) => {
                            await prisma.notifications.create({
                                data: {
                                    type: messageObject.type,
                                    title: messageObject.title,
                                    body: messageObject.body,
                                    data: JSON.stringify(messageObject.data),
                                    user_id: id,
                                    status: notifications_status.UNREAD,
                                    is_deleted: false
                                }
                            });
                        })
                    } else {
                        if (messageObject.receive.role) {
                            const roles = Array.isArray(messageObject.receive.role) ? messageObject.receive.role : [messageObject.receive.role || wsData.existingUser.role];
                            roles.map(async (role) => {
                                if (role) {
                                    const users = await prisma.users.findMany({
                                        where: {
                                            role: role as users_role
                                        }
                                    })
                                    users.map(async (userId) => {
                                        await prisma.notifications.create({
                                            data: {
                                                type: messageObject.type,
                                                title: messageObject.title,
                                                body: messageObject.body,
                                                data: JSON.stringify(messageObject.data),
                                                user_id: userId.id,
                                                status: notifications_status.UNREAD,
                                                is_deleted: false
                                            }
                                        });
                                    })
                                }
                            })
                        } else {
                            const userIds = Array.isArray(messageObject.receive.userId) ? messageObject.receive.userId : [messageObject.receive.userId || wsData.existingUser.id];
                            userIds.map(async (userId) => {
                                await prisma.notifications.create({
                                    data: {
                                        type: messageObject.type,
                                        title: messageObject.title,
                                        body: messageObject.body,
                                        data: JSON.stringify(messageObject.data),
                                        user_id: userId,
                                        status: notifications_status.UNREAD,
                                        is_deleted: false
                                    }
                                });
                            })
                        }
                    }
                }
                const wsMessage = {
                    success: true,
                    type: messageObject.type,
                    title: messageObject.title,
                    body: messageObject.body,
                    receive: messageObject.receive,
                    data: messageObject.data,
                };

                ws.publish("notification", JSON.stringify(wsMessage));

            } catch (error) {
                ws.send(JSON.stringify({
                    success: false,
                    message: "ไม่สามารถบันทึกการแจ้งเตือนได้",
                    error: (error as Error).message
                }));
            }
        },
        close(ws) {
            ws.unsubscribe("notification")
        }
    })

export default app
import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { jwt } from '@elysiajs/jwt';
import { JWTPayloadUser } from '../../../lib/lib';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error("Secret key is undefined!");
}

interface LocationData {
    name: string;
    type: number;
    map: string | null;
    note?: string;
    time_slots: string | null;
    owner_id?: number;
}

interface LocationMapData {
    latitude: string;
    longitude: string;
}

interface AuthUser {
    success: boolean;
    message?: string;
    user?: {
        id: number;
        role: string;
    };
}

const app = new Elysia()
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
        if (!payloadUser || payloadUser.role !== 'admin') {
            set.status = 401;
            return {
                success: false,
                message: "ไม่มีสิทธิ์เข้าถึง"
            };
        }
        return { payloadUser, existingUser }
    })
    .get('', async ({ set }) => {
        try {
            const locations = await prisma.locations.findMany({
                include: {
                    users: true,
                    location_types: true,
                    accommodation: true,
                    attractions: true,
                    hospital: true,
                    learning_resources: true,
                    restaurant: true
                },
                orderBy: { created_at: 'desc' }
            });

            return {
                success: true,
                locations: locations.map(loc => ({
                    ...loc,
                    map: loc.map ? JSON.parse(loc.map as string) : null,
                    time_slots: loc.time_slots ? JSON.parse(loc.time_slots as string) as string[] : null
                }))
            };
        } catch (error) {
            set.status = 500
            return { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' };
        }
    })
    .get('/:id', async ({ set, params: { id } }) => {
        try {
            const locationId = parseInt(id);
            if (isNaN(locationId)) {
                set.status = 400;
                return {
                    success: false,
                    message: "รูปแบบ ID ไม่ถูกต้อง"
                };
            }
            const location = await prisma.locations.findUnique({
                where: {
                    id: locationId
                },
                include: {
                    users: true,
                    location_types: true,
                    accommodation: {
                        include: {
                            subdistricts: true
                        }
                    },
                    attractions: {
                        include: {
                            subdistricts: true
                        }
                    },
                    hospital: {
                        include: {
                            subdistricts: true
                        }
                    },
                    learning_resources: {
                        include: {
                            subdistricts: true
                        }
                    },
                    restaurant: {
                        include: {
                            subdistricts: true
                        }
                    }
                }
            });

            if (!location) {
                set.status = 404;
                return {
                    success: false,
                    message: "ไม่พบข้อมูลสถานที่"
                };
            }

            let locationData = {
                ...location,
                map: null,
                time_slots: null
            };

            if (location.map) {
                try {
                    locationData.map = JSON.parse(location.map);
                } catch (error) {
                    console.error('Error parsing map data:', error);
                }
            }

            if (location.time_slots) {
                try {
                    locationData.time_slots = JSON.parse(location.time_slots);
                } catch (error) {
                    console.error('Error parsing time slots:', error);
                }
            }

            const parseDetailJSON = (detail: any) => {
                if (!detail) return detail;
                console.log(detail);
                try {
                    return {
                        ...detail,
                        contact: detail.contact ? JSON.parse(detail.contact) : null,
                        date_info: detail.date_info ? JSON.parse(detail.date_info) : null,
                        images: detail.images ? JSON.parse(detail.images) : null
                    };
                } catch (error) {
                    console.error('Error parsing detail JSON:', error);
                    return detail;
                }
            };

            if (locationData.accommodation?.length) {
                locationData.accommodation = locationData.accommodation.map(parseDetailJSON);
            }
            if (locationData.attractions?.length) {
                locationData.attractions = locationData.attractions.map(parseDetailJSON);
            }
            if (locationData.hospital?.length) {
                locationData.hospital = locationData.hospital.map(parseDetailJSON);
            }
            if (locationData.learning_resources?.length) {
                locationData.learning_resources = locationData.learning_resources.map(parseDetailJSON);
            }
            if (locationData.restaurant?.length) {
                locationData.restaurant = locationData.restaurant.map(parseDetailJSON);
            }

            return {
                success: true,
                location: locationData
            };

        } catch (error) {
            console.error('Error fetching location:', error);
            set.status = 500;
            return {
                success: false,
                message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
            };
        }
    }, {
        params: t.Object({
            id: t.String()
        }),
    })
    .post('/', async ({ body, payloadUser }) => {
        if (!payloadUser) return
        try {
            const locationData: LocationData = {
                name: body.name,
                type: body.type,
                map: body.map ? JSON.stringify(body.map) : null,
                note: body.note,
                time_slots: body.time_slots ? JSON.stringify(body.time_slots) : null,
                owner_id: body.owner_id
            };

            const location = await prisma.locations.create({
                data: locationData
            });

            return {
                success: true,
                message: 'สร้างสถานที่สำเร็จ',
                location
            };
        } catch (error) {
            console.error('Error creating location:', error);
            return { success: false, message: 'เกิดข้อผิดพลาดในการสร้างสถานที่' };
        }
    }, {
        body: t.Object({
            name: t.String(),
            type: t.Number(),
            map: t.Optional(t.Object({
                latitude: t.String(),
                longitude: t.String()
            })),
            note: t.Optional(t.String()),
            time_slots: t.Optional(t.Array(t.String())),
            owner_id: t.Number()
        }),
    })
    .put('/:id', async ({ params, body, payloadUser }) => {
        if (!payloadUser) return
        const locationId = parseInt(params.id);

        try {
            const existingLocation = await prisma.locations.findUnique({
                where: { id: locationId }
            });

            if (!existingLocation) {
                return { success: false, message: 'ไม่พบสถานที่' };
            }

            // ตรวจสอบสิทธิ์
            if (existingLocation.owner_id && existingLocation.owner_id !== payloadUser.id) {
                return { success: false, message: 'คุณไม่มีสิทธิ์แก้ไขสถานที่นี้' };
            }

            const updateData: LocationData = {
                name: body.name,
                type: body.type,
                map: body.map ? JSON.stringify(body.map) : null,
                note: body.note,
                time_slots: body.time_slots ? JSON.stringify(body.time_slots) : null
            };

            const updatedLocation = await prisma.locations.update({
                where: { id: locationId },
                data: updateData as any
            });

            return {
                success: true,
                message: 'อัพเดทสถานที่สำเร็จ',
                location: updatedLocation
            };
        } catch (error) {
            console.error('Error updating location:', error);
            return { success: false, message: 'เกิดข้อผิดพลาดในการอัพเดทสถานที่' };
        }
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            name: t.String(),
            type: t.Number(),
            map: t.Optional(t.Object({
                latitude: t.String(),
                longitude: t.String()
            })),
            note: t.Optional(t.String()),
            time_slots: t.Optional(t.Array(t.String()))
        }),
    })
    .put('/:id/status', async ({ params, body, payloadUser }) => {
        if (!payloadUser) return
        const locationId = parseInt(params.id);

        try {
            const existingLocation = await prisma.locations.findUnique({
                where: { id: locationId }
            });

            if (!existingLocation) {
                return { success: false, message: 'ไม่พบสถานที่' };
            }

            // ตรวจสอบสิทธิ์
            if (existingLocation.owner_id && existingLocation.owner_id !== payloadUser.id) {
                return { success: false, message: 'คุณไม่มีสิทธิ์แก้ไขสถานะสถานที่นี้' };
            }

            const updatedLocation = await prisma.locations.update({
                where: { id: locationId },
                data: {
                    isActive: body.status === 'active'
                }
            });

            return {
                success: true,
                message: `${body.status === 'active' ? 'เปิด' : 'ปิด'}ให้บริการสำเร็จ`,
                location: updatedLocation
            };
        } catch (error) {
            console.error('Error updating location status:', error);
            return { success: false, message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ' };
        }
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            status: t.Union([t.Literal('active'), t.Literal('inactive')])
        }),
    })
    .delete('/:id',
        async ({ params, payloadUser, set }) => {
            if (!payloadUser) return
            const locationId = parseInt(params.id);

            try {
                const existingLocation = await prisma.locations.findUnique({
                    where: { id: locationId }
                });

                if (!existingLocation) {
                    return { success: false, message: 'ไม่พบสถานที่' };
                }

                // ตรวจสอบสิทธิ์
                if (existingLocation.owner_id && existingLocation.owner_id !== payloadUser.id) {
                    return { success: false, message: 'คุณไม่มีสิทธิ์ลบสถานที่นี้' };
                }

                await prisma.locations.delete({
                    where: { id: locationId }
                });

                return {
                    success: true,
                    message: 'ลบสถานที่สำเร็จ'
                };
            } catch (error) {
                console.error('Error deleting location:', error);
                return { success: false, message: 'เกิดข้อผิดพลาดในการลบสถานที่' };
            }
        }, {
        params: t.Object({
            id: t.String()
        }),
    })

export default app;
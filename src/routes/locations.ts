import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { jwt } from '@elysiajs/jwt';
import { JWTPayloadUser } from '../../lib/lib';

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
    .get("types", async ({ set }) => {
        try {
            const location_type = await prisma.location_types.findMany()
            return {
                success: true,
                location_type
            }
        } catch (error) {
            set.status = 500;
            console.error(error);
            return {
                success: false,
                message: "เกิดข้อผิดพลาดในการดึงหมวดหมู่สถานที่",
                error: error instanceof Error ? error.message : String(error)
            };
        }
    })
    .get('/', async ({ set }) => {
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
            console.error('Error fetching locations:', error);
            return { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' };
        }
    })
export default app;
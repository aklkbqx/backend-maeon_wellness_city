import { Elysia } from 'elysia';
import { PrismaClient } from '@prisma/client';

// อัพเดท type definitions
type ProgramStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';
type ProgramCategory = 'SHORT' | 'LONG';

interface Activity {
    sequence: number;
    start_time: string;
    end_time: string;
    activity: string;
    description?: string;
    location_id?: number;
    location_name?: string;
    location_type?: string;
    services?: string[];
    cost: number;
    included_in_total_price: boolean;
    is_mandatory?: boolean;
    note?: string;
    selected_program?: {
        id: number;
        name: string;
        time: string;
        people_count: number;
        price_per_person: number;
        total_price: number;
    };
    locations?: Array<{
        id: number;
        name: string;
        type: string;
    }>;
}

interface DaySchedule {
    day: number;
    date?: string;
    title: string;
    activities: Activity[];
}

interface ProgramResponse {
    id: number;
    type: number;
    program_category: ProgramCategory;
    name: string;
    description: string;
    schedules: DaySchedule[];
    total_price: number;
    duration_days: number;
    status: ProgramStatus;
    wellness_dimensions?: string[];
    images?: string[];
    created_by?: number;
}

const prisma = new PrismaClient();
const safeJSONParse = (str: string | null, fallback: any = []) => {
    if (!str) return fallback;
    try {
        return JSON.parse(str);
    } catch (e) {
        return str.split(',').map(s => s.trim());
    }
};

const app = new Elysia()
    .get('/ready-made', async ({ set }) => {
        try {
            const programs = await prisma.programs.findMany({
                where: {
                    type: {
                        in: [1, 2]
                    },
                    status: 'CONFIRMED'
                },
                select: {
                    id: true,
                    type: true,
                    program_category: true,
                    name: true,
                    description: true,
                    schedules: true,
                    total_price: true,
                    duration_days: true,
                    status: true,
                    wellness_dimensions: true,
                    images: true,
                    created_at: true,
                    program_types: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            const formattedPrograms = programs.map(program => {
                try {
                    return {
                        id: program.id,
                        type: program.type,
                        program_category: program.program_category,
                        name: program.name,
                        description: program.description,
                        schedules: safeJSONParse(program.schedules),
                        total_price: Number(program.total_price),
                        duration_days: program.duration_days || 1,
                        status: program.status || 'DRAFT',
                        // จัดการ wellness_dimensions เป็นทั้ง string ธรรมดาและ JSON
                        wellness_dimensions: typeof program.wellness_dimensions === 'string'
                            ? [program.wellness_dimensions] // ถ้าเป็น string เดี่ยว ให้แปลงเป็น array
                            : safeJSONParse(program.wellness_dimensions, []),
                        images: safeJSONParse(program.images),
                        created_at: program.created_at
                    };
                } catch (parseError) {
                    console.error(`Error formatting program ${program.id}:`, parseError);
                    // ส่งข้อมูลดิบกลับไปถ้ามีปัญหาในการ parse
                    return {
                        id: program.id,
                        type: program.type,
                        program_category: program.program_category,
                        name: program.name,
                        description: program.description,
                        schedules: [],
                        total_price: Number(program.total_price),
                        duration_days: program.duration_days || 1,
                        status: program.status || 'DRAFT',
                        wellness_dimensions: program.wellness_dimensions ? [program.wellness_dimensions] : [],
                        images: [],
                        created_at: program.created_at
                    };
                }
            });

            if (formattedPrograms.length === 0) {
                set.status = 404;
                return {
                    success: false,
                    message: "No ready-made programs found",
                    programs: []
                };
            }

            set.status = 200;
            return {
                success: true,
                message: "Fetched ready-made programs successfully",
                programs: formattedPrograms
            };

        } catch (error) {
            console.error('Error in /ready-made:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Failed to fetch ready-made programs',
                error: error instanceof Error ? error.message : 'Unknown error',
                programs: []
            };
        }
    })
    .get('/:programId', async ({ params: { programId }, set }) => {
        try {
            const program = await prisma.programs.findUnique({
                where: {
                    id: Number(programId),
                    status: 'CONFIRMED' // เพิ่มเงื่อนไขสถานะ
                },
                include: {
                    program_types: true
                }
            });

            if (!program) {
                set.status = 404;
                return {
                    success: false,
                    message: 'Program not found or not available'
                };
            }

            let formattedPrograms = {}

            try {
                formattedPrograms = {
                    id: program.id,
                    type: program.type,
                    program_category: program.program_category,
                    name: program.name,
                    description: program.description,
                    schedules: safeJSONParse(program.schedules),
                    total_price: Number(program.total_price),
                    duration_days: program.duration_days || 1,
                    status: program.status || 'DRAFT',
                    wellness_dimensions: typeof program.wellness_dimensions === 'string'
                        ? [program.wellness_dimensions]
                        : safeJSONParse(program.wellness_dimensions, []),
                    images: safeJSONParse(program.images),
                    created_at: program.created_at
                }
            } catch (parseError) {
                console.error(`Error formatting program ${program.id}:`, parseError);
                formattedPrograms = {
                    id: program.id,
                    type: program.type,
                    program_category: program.program_category,
                    name: program.name,
                    description: program.description,
                    schedules: [],
                    total_price: Number(program.total_price),
                    duration_days: program.duration_days || 1,
                    status: program.status || 'DRAFT',
                    wellness_dimensions: program.wellness_dimensions ? [program.wellness_dimensions] : [],
                    images: [],
                    created_at: program.created_at
                }
            }

            set.status = 200;
            return {
                success: true,
                message: "Fetched ready-made programs successfully",
                programs: formattedPrograms
            };

        } catch (error) {
            console.error('Error in /:programId:', error);
            set.status = 500;
            return {
                success: false,
                message: 'Failed to fetch program details',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    });

export default app;
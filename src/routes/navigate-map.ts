import Elysia, { t } from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Coordinates {
    latitude: string;
    longitude: string;
}

// ข้อมูลบริการที่มีในแต่ละสถานที่ (ถ้ามี)
export interface ServiceInfo {
    name: string;
    cost?: number;
    description?: string;
}

// ข้อมูลสถานที่ย่อยที่เกี่ยวข้อง (ถ้ามี)
export interface RelatedLocation {
    id: number;
    name: string;
    type: string;
}

// ข้อมูลกิจกรรมในแต่ละสถานที่
export interface ActivityInfo {
    sequence: number;
    activity: string;
    description: string;
    start_time: string;
    end_time: string;
    cost: number;
    included_in_total_price: boolean;
    is_mandatory?: boolean;
    note?: string;
    services?: string[];
    locations?: RelatedLocation[];
}

// ข้อมูลสถานที่พร้อมสถานะ
export interface LocationWithStatus extends ActivityInfo {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    scheduledTime: string;
    address: string;
    type: string;
    isComplete: boolean;
    location_id: number;
    location_name: string;
    location_type: string;
}

// ข้อมูลสรุปการเดินทาง
export interface TravelSummary {
    totalActivities: number;
    completedActivities: number;
    startTime: string | null;
    endTime: string | null;
    totalCost?: number;
    mandatoryActivities?: number;
}

// ข้อมูลเวลา
export interface TimeInfo {
    time: string;
    note: string;
}

// ข้อมูลการเดินทางทั้งหมด
export interface TravelData {
    startInfo: TimeInfo;
    endInfo: TimeInfo;
    destinations: LocationWithStatus[];
    summary: TravelSummary;
}

// ข้อมูล response จาก API
export interface ApiResponse {
    success: boolean;
    data?: TravelData;
    message?: string;
}

// ข้อมูลสำหรับการอัพเดทสถานะ
export interface UpdateStatusRequest {
    locationId: number;
}

export interface UpdateStatusResponse {
    success: boolean;
    message: string;
}

// ข้อมูลกิจกรรมในตารางเวลา
export interface Schedule {
    day: number;
    title: string;
    activities: Array<{
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
        isComplete: boolean;
        services?: string[];
        locations?: RelatedLocation[];
        note?: string;
    }>;
}

// ข้อมูลโปรแกรมการเดินทาง
export interface TravelProgram {
    program_id: number;
    program_name: string;
    date: string;
    schedules: string | Schedule[];
}

// ข้อมูลการจอง
export interface BookingDetails {
    id: number;
    user_id: number;
    booking_details: string | TravelProgram[];
    booking_date: Date;
    start_date: Date;
    end_date: Date;
    people: number;
    total_price: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    created_at: Date;
    updated_at: Date;
}

const getLocationAddress = async (locationId: string, locationType: string) => {
    let address = '';

    switch (locationType) {
        case 'accommodation': {
            const result = await prisma.accommodation.findFirst({
                where: { location_id: parseInt(locationId) }
            });
            address = result?.address || '';
            break;
        }
        case 'attractions': {
            const result = await prisma.attractions.findFirst({
                where: { location_id: parseInt(locationId) }
            });
            address = result?.address || '';
            break;
        }
        case 'hospital': {
            const result = await prisma.hospital.findFirst({
                where: { location_id: parseInt(locationId) }
            });
            address = result?.address || '';
            break;
        }
        case 'learning_resources': {
            const result = await prisma.learning_resources.findFirst({
                where: { location_id: parseInt(locationId) }
            });
            address = result?.address || '';
            break;
        }
        case 'restaurant': {
            const result = await prisma.restaurant.findFirst({
                where: { location_id: parseInt(locationId) }
            });
            address = result?.address || '';
            break;
        }
    }

    return address;
};


const app = new Elysia()
    .get("/:booking_id", async ({ params: { booking_id } }): Promise<ApiResponse> => {
        try {
            const booking = await prisma.bookings.findUnique({
                where: { id: parseInt(booking_id) },
                include: { users: true }
            }) as BookingDetails | null;

            if (!booking) {
                return { success: false, message: "ไม่พบข้อมูลการจอง" };
            }

            // แก้ไขการ parse booking_details
            const bookingDetails = typeof booking.booking_details === 'string'
                ? JSON.parse(booking.booking_details) as TravelProgram[]
                : booking.booking_details as TravelProgram[];

            const destinations: LocationWithStatus[] = [];
            let firstTime: string | null = null;
            let lastTime: string | null = null;

            for (const program of bookingDetails) {
                const schedules = typeof program.schedules === 'string'
                    ? JSON.parse(program.schedules) as Schedule[]
                    : program.schedules;

                for (const schedule of schedules) {
                    for (const activity of schedule.activities) {
                        if (!firstTime || activity.start_time < firstTime) {
                            firstTime = activity.start_time;
                        }
                        if (!lastTime || activity.end_time > lastTime) {
                            lastTime = activity.end_time;
                        }

                        if (activity.location_id) {
                            const location = await prisma.locations.findUnique({
                                where: { id: activity.location_id }
                            });

                            if (location) {
                                const locationMap = JSON.parse(location.map || '{}');
                                const address = await getLocationAddress(
                                    activity.location_id.toString(),
                                    activity.location_type
                                );

                                destinations.push({
                                    ...activity,
                                    id: location.id,
                                    name: activity.location_name, // เพิ่ม name
                                    latitude: locationMap.latitude || '',
                                    longitude: locationMap.longitude || '',
                                    scheduledTime: `${activity.start_time} - ${activity.end_time}`,
                                    address,
                                    type: activity.location_type, // เพิ่ม type
                                    isComplete: activity.isComplete || false,
                                    location_id: activity.location_id,
                                    location_name: activity.location_name,
                                    location_type: activity.location_type
                                } as LocationWithStatus);
                            }
                        }
                    }
                }
            }

            destinations.sort((a, b) => a.sequence - b.sequence);

            const travelData: TravelData = {
                startInfo: {
                    time: firstTime || '',
                    note: 'เริ่มต้นการเดินทาง'
                },
                endInfo: {
                    time: lastTime || '',
                    note: 'สิ้นสุดการเดินทาง'
                },
                destinations,
                summary: {
                    totalActivities: destinations.length,
                    completedActivities: destinations.filter(d => d.isComplete).length,
                    startTime: firstTime,
                    endTime: lastTime,
                    totalCost: destinations.reduce((sum, d) => sum + d.cost, 0),
                    mandatoryActivities: destinations.filter(d => d.is_mandatory).length
                }
            };

            return {
                success: true,
                data: travelData
            };

        } catch (error) {
            console.error('Error getting travel data:', error);
            return { success: false, message: String(error) };
        }
    })

    .post("/:booking_id/complete", async ({ params: { booking_id }, body }): Promise<UpdateStatusResponse> => {
        try {
            const booking = await prisma.bookings.findUnique({
                where: { id: parseInt(booking_id) }
            });

            if (!booking) {
                return {
                    success: false,
                    message: "ไม่พบข้อมูลการจอง"
                };
            }
            const bookingDetails = typeof booking.booking_details === 'string'
                ? JSON.parse(booking.booking_details) as TravelProgram[]
                : booking.booking_details as TravelProgram[];

            let updated = false;

            for (const program of bookingDetails) {
                const schedules = typeof program.schedules === 'string'
                    ? JSON.parse(program.schedules) as Schedule[]
                    : program.schedules;

                for (const schedule of schedules) {
                    for (const activity of schedule.activities) {
                        if (activity.location_id === body.locationId) {
                            activity.isComplete = true;
                            updated = true;
                        }
                    }
                }
                // แปลงกลับเป็น string
                program.schedules = JSON.stringify(schedules);
            }

            if (updated) {
                await prisma.bookings.update({
                    where: { id: parseInt(booking_id) },
                    data: {
                        booking_details: JSON.stringify(bookingDetails)
                    }
                });

                return {
                    success: true,
                    message: "อัพเดทสถานะเรียบร้อยแล้ว"
                };
            }

            return {
                success: false,
                message: "ไม่พบสถานที่ที่ระบุในการจอง"
            };

        } catch (error) {
            console.error('Error updating completion status:', error);
            return {
                success: false,
                message: String(error)
            };
        }
    }, {
        body: t.Object({
            locationId: t.Number()
        })
    });

export default app;
import { users_account_status, users_usage_status, users_role, notifications_type } from '@prisma/client';

export type JWTPayloadUser = {
    id: number;
    role: string;
}

export interface USER_TYPE {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    tel: string;
    profile_picture: string;
    role: users_role;
    usage_status: users_usage_status;
    statusLastUpdate: Date;
    account_status: users_account_status;
    createdAt: Date
    updatedAt: Date
}
export interface NotificationData {
    type: notifications_type;
    title: string;
    body: string;
    receive: {
        userId?: number | number[];
        all: boolean;
        role?: string | string[] | users_role;
    };
    data?: {
        link?: {
            pathname: string;
            params?: {}
        }
    };
    dev?: boolean
}


const SECRET_KEY = process.env.SECRET_KEY;
const WS_URL = process.env.WS_URL

if (!SECRET_KEY || !WS_URL) {
    throw new Error('SECRET KEY is not defined.');
}

export function getThaiDate(dateString?: string): Date | string {
    const thailandTimezoneOffset = 7 * 60 * 60 * 1000;
    if (dateString) {
        const inputDate = new Date(dateString);
        if (isNaN(inputDate.getTime())) {
            throw new Error('Invalid date string provided');
        }
        const thailandTime = new Date(inputDate.getTime() + thailandTimezoneOffset);
        return thailandTime;
    } else {
        const currentTime = new Date();
        const thailandTime = new Date(currentTime.getTime() + thailandTimezoneOffset);
        return thailandTime.toISOString();
    }
}

export const sendNotification = async (token: string, notificationData: NotificationData) => {
    try {
        const ws = new WebSocket(`${WS_URL}/api/ws/notification?token=${token}`);
        const data = JSON.stringify(notificationData)
        ws.onopen = () => {
            setTimeout(() => {
                ws.send(data)
                ws.close()
            }, 1000)
        }
    } catch (error) {
        console.error('Failed to send notification:', error);
        throw error;
    }

};

export const addCommas = (num: string | number | null | undefined): string => {
    if (num === null || num === undefined) return "0";
    const number = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(number)) return "0";
    return new Intl.NumberFormat('th-TH').format(number);
};

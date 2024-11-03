import { Elysia, t } from 'elysia';
import { notifications_type, PrismaClient, users_account_status, users_role, users_usage_status } from '@prisma/client';
import { jwt } from '@elysiajs/jwt';
import { randomInt } from 'crypto';
import { getThaiDate, JWTPayloadUser, sendNotification } from '../../lib/lib';
import axios from 'axios';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY
const SMS_API_KEY = process.env.SMS_API_KEY
const SMS_API_SECRET = process.env.SMS_API_SECRET
const WS_URL = process.env.WS_URL

if (!SECRET_KEY || !SMS_API_KEY || !SMS_API_SECRET || !WS_URL) {
    throw new Error("Key and Secret Key undefined!");
}

interface TempUser {
    firstname: string;
    lastname: string;
    tel: string;
    email: string;
    password: string;
    otp: string;
    otp_expiry: Date;
}

const tempUsers = new Map<string, TempUser>();

const sendOtpMessage = async (phone: string, otp: string, set: any) => {
    try {
        const encoded = Buffer.from(SMS_API_KEY + ':' + SMS_API_SECRET).toString('base64');
        const response = await axios.post("https://api-v2.thaibulksms.com/sms", {
            msisdn: phone,
            message: `รหัสยืนยัน OTP ในการสมัครสามาชิก Mae On Wellness City ของคุณคือ ${phone}`,
            sender: "MaeOn"
        }, {
            headers: {
                "Authorization": `Basic ${encoded}`,
                "Content-Type": "application/json"
            }
        })
        if (response.data) {
            console.log(response.data);
            console.log(`OTP for ${phone}: ${otp}`);
        } else {
            throw new Error(`ไม่สามารถส่ง OTP ไปยัง ${phone} ได้ กรุณาลองใหม่อีกครั้ง`);
        }
    } catch (error) {
        set.status = 400;
        return {
            success: false,
            message: error
        }
    }
}

const app = new Elysia()
    .use(jwt({ name: 'jwt', secret: SECRET_KEY }))
    .post('/register', async ({ body, set }) => {
        const { firstname, lastname, tel, email, password } = body;
        try {
            const phone = tel.split("-").join("").trim()
            const existingUser = await prisma.users.findUnique({
                where: { email }
            });

            if (existingUser) {
                set.status = 400;
                return { success: false, message: 'มีอีเมลนี้อยู่ในระบบอยู่แล้ว\nกรุณาเปลี่ยนอีเมล หรือทำการเข้าสู่ระบบ' };
            }

            const existingAccounts = await prisma.users.count({
                where: { tel: phone }
            });

            if (existingAccounts >= 3) {
                set.status = 400;
                return {
                    success: false,
                    message: 'เบอร์โทรศัพท์นี้ถูกใช้ครบ 3 บัญชีแล้ว\nกรุณาใช้เบอร์โทรศัพท์อื่น'
                };
            }

            const hashedPassword = await Bun.password.hash(password, {
                algorithm: "bcrypt",
                cost: 4,
            });

            const otp = randomInt(100000, 999999).toString();
            const tempUser: TempUser = {
                firstname,
                lastname,
                tel: phone,
                email,
                password: hashedPassword,
                otp,
                otp_expiry: new Date(Date.now() + 10 * 60 * 1000),
            };

            if (tempUsers.has(phone)) {
                tempUsers.delete(phone);
            }

            tempUsers.set(phone, tempUser);
            await sendOtpMessage(phone, otp, set)

            set.status = 201;
            return {
                success: true,
                message: 'กรุณายืนยัน OTP เพื่อเสร็จสิ้นการสมัครสมาชิก',
            };
        } catch (error) {
            console.error('Registration error:', error);
            set.status = 500;
            return { success: false, message: 'ข้อผิดพลาดของเซิร์ฟเวอร์ภายใน', error: (error as Error).message };
        }
    }, {
        body: t.Object({
            firstname: t.String(),
            lastname: t.String(),
            tel: t.String(),
            email: t.String(),
            password: t.String(),
        })
    })
    .post('/verify-otp', async ({ body, jwt, set }) => {
        const { phone, otp } = body;
        try {
            const tel = phone.split("-").join("").trim()
            const tempUser = tempUsers.get(tel);
            if (!tempUser) {
                set.status = 404;
                return { success: false, message: 'ไม่พบข้อมูลการลงทะเบียน กรุณาลงทะเบียนใหม่' };
            }
            if (tempUser.otp !== otp) {
                set.status = 400;
                return { success: false, message: 'OTP ไม่ถูกต้อง' };
            }
            if (tempUser.otp_expiry < new Date()) {
                set.status = 400;
                return { success: false, message: 'OTP หมดอายุ' };
            }

            const newUser = await prisma.users.create({
                data: {
                    firstname: tempUser.firstname,
                    lastname: tempUser.lastname,
                    tel: tempUser.tel,
                    email: tempUser.email,
                    password: tempUser.password,
                    role: users_role.user,
                    usage_status: users_usage_status.ONLINE,
                    status_last_update: getThaiDate(),
                    account_status: users_account_status.ACTIVE,
                    created_at: getThaiDate(),
                }
            });

            tempUsers.delete(tel);

            const token = await jwt.sign({ id: newUser.id, role: newUser.role as string });

            setTimeout(async () => {
                await sendNotification(token, {
                    type: notifications_type.SYSTEM,
                    receive: {
                        userId: newUser.id,
                        all: false
                    },
                    title: "ยินดีต้อนรับสู่ Mae On Wellness City",
                    body: "ขอบคุณที่เป็นส่วนหนึ่งของเรา",
                    data: {
                        link: {
                            pathname: "/user/home"
                        }
                    }
                });
            }, 5000)

            return {
                success: true,
                token,
                message: 'ยืนยัน OTP สำเร็จ! การลงทะเบียนเสร็จสมบูรณ์'
            };
        } catch (error) {
            set.status = 500;
            return { success: false, message: 'ข้อผิดพลาดของเซิร์ฟเวอร์ภายใน', error: (error as Error).message };
        }
    }, {
        body: t.Object({
            phone: t.String(),
            otp: t.String(),
        })
    })
    .post('/resend-otp', async ({ body, set }) => {
        const { phone } = body;
        try {
            const tel = phone.split("-").join("").trim()
            const tempUser = tempUsers.get(tel);
            if (!tempUser) {
                set.status = 404;
                return { success: false, message: 'ไม่พบข้อมูลการลงทะเบียน กรุณาลงทะเบียนใหม่' };
            }
            const otp = randomInt(100000, 999999).toString();
            tempUser.otp = otp;
            tempUser.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
            tempUsers.set(tel, tempUser);

            console.log(tel);
            await sendOtpMessage(tel, otp, set)

            return { success: true, message: 'ส่ง OTP ใหม่แล้ว' };
        } catch (error) {
            set.status = 500;
            return { success: false, message: 'ไม่สามารถส่ง OTP ใหม่ได้ กรุณาลองใหม่อีกครั้ง', error: (error as Error).message };
        }
    }, {
        body: t.Object({
            phone: t.String(),
        })
    })
    .post('/login', async ({ body, jwt, set }) => {
        const { email, password } = body;
        try {
            const user = await prisma.users.findUnique({
                where: { email }
            });
            if (!user) {
                set.status = 401;
                return {
                    success: false,
                    message: "ไม่มีข้อมูลของคุณในระบบ."
                };
            }
            const isPasswordValid = await Bun.password.verify(password, user.password);
            if (!isPasswordValid) {
                set.status = 401;
                return {
                    success: false,
                    message: "รหัสผ่านไม่ถูกต้อง."
                };
            }
            if (user.account_status !== users_account_status.ACTIVE) {
                set.status = 403;
                return {
                    success: false,
                    message: "บัญชีของคุณถูกระงับ กรุณาติดต่อผู้ดูแลระบบ"
                };
            }
            const token = await jwt.sign({ id: user.id, role: user.role as string });

            await prisma.users.update({
                where: { id: user.id },
                data: { usage_status: users_usage_status.ONLINE, status_last_update: getThaiDate() }
            });

            return {
                success: true,
                token,
                role: user.role,
                message: "เข้าสู่ระบบเสร็จสิ้น!"
            };
        } catch (error) {
            set.status = 500;
            return {
                success: false,
                message: `Something went wrong: ${(error as Error).message}`
            };
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String(),
        })
    })

    .post('/logout', async ({ headers, set, jwt }) => {
        const authHeader = headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            set.status = 401;
            return { success: false, message: "ไม่พบ Token การยืนยันตัวตน" };
        }
        const token = authHeader.split(' ')[1];
        try {
            const payload = await jwt.verify(token) as JWTPayloadUser;
            if (!payload || typeof payload === 'string' || !payload.id) {
                set.status = 401;
                return { success: false, message: "Token ไม่ถูกต้อง" };
            }
            await prisma.users.update({
                where: { id: payload.id },
                data: {
                    usage_status: users_usage_status.OFFLINE,
                    status_last_update: getThaiDate()
                }
            });
            return { success: true, message: "ออกจากระบบเรียบร้อยแล้ว" };
        } catch (error) {
            set.status = 500;
            return { success: false, message: `เกิดข้อผิดพลาด: ${(error as Error).message}` };
        }
    })


export default app;
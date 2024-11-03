import { Elysia, t } from 'elysia';
import { notifications_type, payments_payment_method, payments_status, PrismaClient, users_role } from '@prisma/client';
import { jwt } from '@elysiajs/jwt';
import generatePayload from 'promptpay-qr';
import { addCommas, getThaiDate, JWTPayloadUser, sendNotification } from '../../lib/lib';
import path from 'path';
import { unlink } from "node:fs/promises";
import axios from 'axios';
import { compareTwoStrings } from 'string-similarity';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;
const KEY_OPENSLIP = process.env.KEY_OPENSLIP;

if (!SECRET_KEY || !KEY_OPENSLIP) {
    throw new Error('KEY is not defined.');
}

const PROMPTPAY_ID = '0902856188';
const BANK_ACCOUNT_NUMBER = "";
const BANK_NAME = ""

const receiver = {
    displayName: "นาย เอกลักษณ์ เครือบูรณ์",
    name: "Mr. Akalak Kruaboon",
    account: {
        value: "608-0-28271-2",
        bank: "ธนาคารกรุงไทย"
    }
}

let slipFilePath = "";

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
        return { payloadUser }
    })
    .get("/:booking_id", async ({ set, params: { booking_id }, payloadUser }) => {
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }
        try {
            const payments = await prisma.payments.findUnique({
                where: { booking_id: parseInt(booking_id) }
            })
            if (!payments) {
                set.status = 404
                return {
                    success: true,
                    message: "ไม่พบข้อมูลของการชำระเงินของการจองของคุณ"
                }
            }
            return {
                success: true,
                payments
            }
        } catch (error) {
            return
        }
    })
    .put("/initiate-payment", async ({ body, set, payloadUser }) => {
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }
        try {
            const { booking_id, payment_method } = body;

            const booking = await prisma.bookings.findUnique({
                where: { id: booking_id, user_id: payloadUser.id }
            });

            const payments = await prisma.payments.findUnique({
                where: { id: booking_id }
            })

            if (!booking) {
                set.status = 404;
                return { success: false, message: "ไม่พบการจอง" };
            }

            if (payments?.status === 'PAID') {
                set.status = 400
                return { success: false, message: "ชำระเงินจองเรียบร้อยแล้ว" };
            }

            const amount = booking.total_price.toNumber();

            let paymentData: any = {};
            let responseData: any = {
                amount: amount,
                ref: `BOOKING-${booking.id}`
            };

            switch (payment_method) {
                case 'PROMPTPAY':
                    const payload = generatePayload(PROMPTPAY_ID, { amount });
                    paymentData.qr_code_data = payload;
                    paymentData.promptpay_id = PROMPTPAY_ID;
                    responseData.qr_code = payload;
                    break;

                case 'BANK_ACCOUNT_NUMBER':
                    paymentData.bank_account_number = BANK_ACCOUNT_NUMBER
                    paymentData.bank_name = BANK_NAME
                    responseData.bank_account_number = paymentData.bank_account_number;
                    responseData.bank_name = paymentData.bank_name;
                    break;

                default:
                    set.status = 400;
                    return { success: false, message: "วิธีการชำระเงินไม่ถูกต้อง" };
            }

            const payment = {
                booking_id: booking.id,
                payment_method: payment_method as payments_payment_method,
                payment_data: JSON.stringify(paymentData),
                status: payments_status.PENDING,
                transaction_id: `${payment_method}-${booking.id}-${Date.now()}`,
                payment_date: new Date(),
                slip_image: null
            };

            const createdPayment = await prisma.payments.update({
                data: payment,
                where: {
                    booking_id: booking.id
                }
            });

            return {
                success: true,
                message: `การเริ่มชำระเงินสำเร็จแล้วสำหรับ ${payment_method}`,
                data: {
                    ...responseData,
                    payment_id: createdPayment.id
                }
            };
        } catch (error) {
            set.status = 500;
            console.error(error);
            return {
                success: false,
                message: "เกิดข้อผิดพลาดขณะเริ่มการชำระเงิน",
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }, {
        body: t.Object({
            booking_id: t.Number(),
            payment_method: t.Enum(payments_payment_method)
        })
    })
    .post("/confirm-payment", async ({ headers, request, body, set, payloadUser }) => {
        const authHeader = headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            set.status = 401;
            return { success: false, message: "ไม่พบ Token การยืนยันตัวตน" };
        }
        const token = authHeader.split(' ')[1];
        if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
            set.status = 400;
            return { success: false, message: "Content type must be multipart/form-data" };
        }
        if (!payloadUser) {
            set.status = 401;
            return { success: false, message: "token ไม่ถูกต้อง" };
        }
        const { booking_id, slip } = body;
        try {
            const user = await prisma.users.findUnique({
                where: {
                    id: payloadUser.id
                }
            })
            const booking = await prisma.bookings.findUnique({
                where: { id: parseInt(booking_id), user_id: payloadUser.id }
            });
            if (!booking) {
                set.status = 404;
                return { success: false, message: "ไม่พบการจอง" };
            }
            const payment = await prisma.payments.findFirst({
                where: { booking_id: booking.id }
            });
            if (!payment) {
                set.status = 404;
                return { success: false, message: "ไม่พบข้อมูลการชำระเงิน" };
            }
            if (payment.status === 'PAID') {
                set.status = 400;
                return { success: false, message: "ชำระเงินไปแล้ว" };
            }
            if (!slip) {
                set.status = 400;
                return { success: false, message: "กรุณาอัพโหลดสลิปมาใหม่อีกครั้ง" }
            }

            let slipName = "";
            let slipFilePath = "";
            try {
                slipName = `${payloadUser.id}-${Date.now()}${path.extname(slip.name)}`;
                slipFilePath = `public/images/qrcode_payment/${slipName}`;
                await Bun.write(slipFilePath, await slip.arrayBuffer());
            } catch (error) {
                console.error(`เกิดข้อผิดพลาดในการอัพโหลดสลิปใหม่อีกครั้ง: ${error}`);
                return ({ success: false, message: "ไม่สามารถอัพโหลดรูปสลิปได้" });
            }

            let refNbr = "";

            if (slipFilePath && slipName) {
                const formQRCode = new FormData();
                try {
                    formQRCode.append("file", slip);

                    const qrserver = await axios.post("http://api.qrserver.com/v1/read-qr-code/", formQRCode, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    });

                    if (qrserver.data) {
                        refNbr = qrserver.data[0].symbol[0].data
                    } else {
                        throw new Error("ไม่สามารถอ่านข้อมูลของ QR Code ของคุณได้ กรุณาทำการอัพโหลดสลิปมาอีกครั้ง")
                    }
                } catch (error) {
                    await deleteSlip(slipFilePath);
                    set.status = 400;
                    return {
                        success: false,
                        message: error
                    }
                }
            }

            if (!refNbr) {
                return { success: false, message: "ไม่สามารถตรวจสอบสลิปได้ กรุณาอัพโหลดสลิปมาใหม่อีกครั้ง" }
            }

            await prisma.payments.update({
                where: { id: payment.id },
                data: {
                    status: payments_status.PENDING_VERIFICATION,
                    transaction_id: refNbr,
                    payment_date: getThaiDate(),
                    slip_image: slipName
                }
            });

            let remainingChecks = await getRemainingChecks();

            if (!remainingChecks) {
                set.status = 404;
                return { success: false, message: "ไม่พบจำนวนการตรวจสอบสลิปที่เหลือ" };
            }

            if (remainingChecks <= 3) {
                return {
                    success: true, message: "อาจจะใช้เวลาสักครู่ อย่าออกจากแอพ!", resetSlip: true
                }
            }

            const checkSlip = async (refNbr: string, amount: number, token: string) => {
                try {
                    const response = await axios.post("https://api.openslipverify.com/", {
                        refNbr,
                        amount,
                        token
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });
                    console.log(response.data);

                    if (!response.data) {
                        throw new Error(response.data.msg);
                    }

                    return response.data;
                } catch (error) {
                    console.error("Error checking slip:", error);
                    return {
                        success: false,
                        message: "เกิดข้อผิดพลาดในการตรวจสอบสลิป"
                    };
                }
            };

            const datacheckslip = await checkSlip(refNbr, parseFloat(booking.total_price as any), KEY_OPENSLIP);
            await updateRemainingChecks(remainingChecks - 1);

            if (datacheckslip && datacheckslip.success) {
                const apiReceiver = datacheckslip.data.receiver;
                const similarityThreshold = 0.8;

                const isSimilar = (str1: string, str2: string) =>
                    compareTwoStrings(str1.replace(/\s/g, '').toLowerCase(), str2.replace(/\s/g, '').toLowerCase()) >= similarityThreshold;

                const removeAllWhitespace = (str: string): string => {
                    return str.replace(/\s/g, '');
                }

                // const compareAccounts = (acc1: string, acc2: string): boolean => {
                //     const clean1 = acc1.replace(/\D/g, '');
                //     const clean2 = acc2.replace(/[^\dx]/gi, '');

                //     if (clean1.length !== clean2.length) return false;

                //     return clean1.split('').every((char, i) =>
                //         clean2[i] === 'x' || char === clean2[i]
                //     );
                // }

                const isMatch =
                    isSimilar(removeAllWhitespace(receiver.displayName.trim()), removeAllWhitespace(apiReceiver.displayName?.trim() ?? '')) &&
                    isSimilar(removeAllWhitespace(receiver.name.toLowerCase()), removeAllWhitespace(apiReceiver.name?.toLowerCase() ?? ''));

                if (isMatch) {
                    // await prisma.payments.update({
                    //     where: { id: payment.id },
                    //     data: {
                    //         status: payments_status.PAID,
                    //         payment_date: getThaiDate(),
                    //         transaction_id: refNbr
                    //     }
                    // });
                    // await sendNotification(token, {
                    //     type: notifications_type.PAYMENT,
                    //     receive: {
                    //         userId: payloadUser.id,
                    //         all: false,
                    //     },
                    //     title: `ชำระเงินสำเร็จ`,
                    //     body: `การชำระเงินของคุณสำเร็จแล้ว จำนวน ฿${addCommas(String(booking.total_price as any))} บาท`,
                    //     data: {
                    //         link: {
                    //             pathname: `/user/payments/success`,
                    //             params: {
                    //                 bookingId: booking.id
                    //             }
                    //         }
                    //     }
                    // });

                    // await sendNotification(token, {
                    //     type: notifications_type.PAYMENT,
                    //     receive: {
                    //         all: false,
                    //         role: users_role.admin
                    //     },
                    //     title: `คุณ ${user?.firstname} ชำระเงินสำเร็จแล้ว`,
                    //     body: `จำนวน ฿${addCommas(String(booking.total_price as any))} บาท ดูรายละเอียดได้ที่นี่`,
                    //     data: {
                    //         link: {
                    //             pathname: `/admin/payments`,
                    //             params: {
                    //                 bookingId: booking.id
                    //             }
                    //         }
                    //     }
                    // });

                    return {
                        success: true,
                        message: "การชำระเงินเสร็จสมบูรณ์แล้ว กำลังรอการอนุมัติ",
                        payment_id: payment.id
                    };
                } else {
                    set.status = 400;
                    return {
                        success: false,
                        message: "ข้อมูลบัญชีผู้รับเงินไม่ถูกต้อง กรุณาตรวจข้อมูลการของบัญชีผู้รับเงินในสลิปของคุณ",
                    };
                }
            } else {
                const payments = await prisma.payments.update({
                    where: { id: payment.id },
                    data: {
                        status: payments_status.PENDING_VERIFICATION,
                        payment_date: getThaiDate(),
                        transaction_id: refNbr
                    }
                });
                const bookings = await prisma.bookings.findUnique({
                    where: { id: parseInt(booking_id) },
                });

                await sendNotification(token, {
                    type: notifications_type.PAYMENT,
                    receive: {
                        userId: payloadUser.id,
                        all: false,
                    },
                    title: `ส่งการชำระเงินแล้ว`,
                    body: `การชำระเงินของคุณอยู่ในขั้นตอนการตรวจสอบการชำระเงิน จำนวน ฿${addCommas(booking.total_price as any)} บาท กรุณารอการยืนยันจากเจ้าหน้าที่ ขอบคุณครับ :)`,
                    data: {
                        link: {
                            pathname: `/user/payments/success`,
                            params: {
                                bookingId: booking.id
                            }
                        }
                    }
                });

                await sendNotification(token, {
                    type: notifications_type.PAYMENT,
                    receive: {
                        all: false,
                        role: users_role.admin
                    },
                    title: `คุณ ${user?.firstname} ทำรายการการชำระเงิน`,
                    body: `มีการชำระเงินเข้ามา จำนวน ฿${addCommas(booking.total_price as any)} บาท ดูรายละเอียดได้ที่นี่เพื่อทำการตรวจสอบ`,
                    data: {
                        link: {
                            pathname: `/admin/payments`,
                            params: {
                                bookingId: booking.id
                            }
                        }
                    }
                });
                return {
                    success: true,
                    message: "สลิปของคุณถูกบันทึกแล้ว และอยู่ระหว่างการตรวจสอบด้วยเจ้าหน้าที่ กรุณารอการยืนยันภายใน 24 ชั่วโมง",
                    data: {
                        payments,
                        bookings
                    }
                };
            }
        } catch (error) {
            set.status = 500;
            console.error(error);
            await deleteSlip(slipFilePath)
            return {
                success: false,
                message: "An error occurred while processing the payment",
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }, {
        body: t.Object({
            booking_id: t.String(),
            slip: t.File()
        })
    })
    .post("/reset-slip-check-count", async ({ set }) => {
        const remainingChecks = await getRemainingChecks();
        if (!remainingChecks || remainingChecks > 3) {
            return { success: true, message: "ยังมี credit เหลืออยู่" };
        }
        try {
            const resetChecks = await resetSlipCheckCount();
            if (resetChecks === 20) {
                return { success: true, message: `Reset credit เรียบร้อย (${resetChecks} credits)` };
            }
        } catch (error) {
            set.status = 500;
            console.error(`เกิดข้อผิดพลาดขณะ reset credit: ${error}`);
            return {
                success: false,
                message: "เกิดข้อผิดพลาดขณะรีเซ็ตการตรวจสอบสลิป กรุณาลองอีกครั้ง",
            };
        }
    })


async function resetSlipCheckCount() {
    try {
        const response = await fetch('http://localhost:3001/reset-openslip-credit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: process.env.TOKEN_OPENSLIP
            })
        });

        const result = await response.json();

        if (result.success && result.credits === 20) {
            await updateRemainingChecks(20);
            return 20;
        }

        return 0;
    } catch (error) {
        console.error('Error in resetSlipCheckCount:', error);
        throw error;
    }
}

async function updateRemainingChecks(count: number) {
    await prisma.slip_remaining.update({
        where: { id: 1 },
        data: { count: count }
    });
    console.log(`Updated remaining checks to ${count}`);
}

async function getRemainingChecks() {
    const result = await prisma.slip_remaining.findFirst();
    return result?.count
}

const deleteSlip = async (slipFilePath: string) => {
    if (slipFilePath) {
        try {
            await unlink(slipFilePath);
        } catch (error) {
            console.error(`เกิดข้อผิดพลาดในการลบรูปภาพสลิป: ${error}`);
        }
    }
}

export default app;
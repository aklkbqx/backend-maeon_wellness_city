import { PrismaClient } from "@prisma/client";
import Elysia from "elysia";

const prisma = new PrismaClient()
const app = new Elysia()
    .get("/", async ({ set }) => {
        try {
            const subdistricts = await prisma.subdistricts.findMany()
            return {
                success: true,
                subdistricts
            };
        } catch (error) {
            console.error("Error fetching bookings:", error);
            set.status = 500;
            return {
                success: false,
                message: "เกิดข้อผิดพลาดขณะดึงข้อมูลรายละเอียดการจองทั้งหมดของคุณ",
                error: error instanceof Error ? error.message : String(error)
            };
        }
    })

export default app
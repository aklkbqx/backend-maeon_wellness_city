import { chromium, Browser, Page } from 'playwright';
import * as path from 'path';

interface VerificationResult {
    success: boolean;
    msg: string;
}

async function verifySlip(imagePath: string, amount: string): Promise<VerificationResult> {
    let browser: Browser | null = null;
    let page: Page | null = null;

    try {
        browser = await chromium.launch({ headless: true });
        page = await browser.newPage();
        await page.goto('https://openslipverify.com/');

        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
            await fileInput.setInputFiles(imagePath);
        } else {
            throw new Error('ไม่พบช่องอัปโหลดไฟล์');
        }

        await page.fill('input[placeholder="จำนวนเงิน"]', amount);
        await page.waitForSelector('button:not([disabled])', { state: 'attached' });

        let attempt = 0;
        while (true) {
            attempt++;
            console.log(`ความพยายามครั้งที่ ${attempt}`);
            await page.click('button:has-text("ตรวจสลิป")');
            await page.waitForSelector('code', { state: 'attached', timeout: 10000 });
            await page.waitForFunction(() => {
                const codeElement = document.querySelector('code');
                return codeElement && codeElement.textContent && codeElement.textContent !== '{}';
            }, { timeout: 10000 });

            const resultText = await page.$eval('code', (el) => el.textContent);

            if (resultText) {
                const result: VerificationResult = JSON.parse(resultText);
                console.log(`ผลลัพธ์ (ครั้งที่ ${attempt}):`, result);

                if (result.msg !== "กรุณาใช้งาน Demo Application ผ่านหน้าเว็บไซต์เท่านั้น") {
                    return result;
                }
            }
            await page.waitForTimeout(2000);
            await page.waitForSelector('button:not([disabled])', { state: 'attached' });
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        throw error;
    } finally {
        if (page) await page.close();
        if (browser) await browser.close();
    }
}

const imagePath = path.join(__dirname, 'public/images/qrcode_payment/2-1728447295957.jpg');
const amount = '1';

verifySlip(imagePath, amount)
    .then((result) => console.log('ผลลัพธ์สุดท้าย:', result))
    .catch((error) => console.error('เกิดข้อผิดพลาด:', error));



    // async function resetSlipCheckCount() {
    //     const browser = await chromium.launch({
    //         headless: true,
    //         args: ['--no-sandbox', '--disable-setuid-sandbox']
    //     });
    //     const context = await browser.newContext();
    //     const page = await context.newPage();
    //     const TOKEN_OPENSLIP = process.env.TOKEN_OPENSLIP || "";
    //     await context.addCookies([{
    //         name: "token",
    //         value: TOKEN_OPENSLIP,
    //         domain: "dev.openslipverify.com",
    //         path: "/"
    //     }]);
    
    //     console.log("start reset slip check");
    
    //     await page.goto("https://dev.openslipverify.com/Dashboard");
    //     const buttonSelector = 'button[class="py-3 self-end px-4 inline-flex gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-blue-500"]';
    
    //     let currentvalue = 0
    
    //     for (let i = 0; i < 20; i++) {
    //         try {
    //             await page.reload();
    //             await page.waitForLoadState('networkidle');
    
    //             const value = await page.evaluate(() => {
    //                 const elements = document.querySelectorAll('p[class="text-3xl font-semibold text-blue-600"]');
    //                 return elements.length >= 3 ? elements[2].textContent : null;
    //             });
    
    //             console.log(`Loop ${i + 1}: Current value = ${value}`);
    //             if (value === '20') {
    //                 console.log("Target value reached. Stopping loop.");
    //                 currentvalue = parseInt(value as string)
    //                 break;
    //             }
    
    //             await page.click(buttonSelector, { timeout: 2000 });
    //             console.log("Button clicked.");
    
    //         } catch (error) {
    //             console.error(`Loop ${i + 1}: Failed to reset credit. Error: ${error}`);
    //         }
    
    //         await page.waitForTimeout(1000);
    //     }
    
    //     if (currentvalue === 20) {
    //         await browser.close();
    //         await updateRemainingChecks(currentvalue);
    //         const currentCredit = await getRemainingChecks();
    //         return currentCredit;
    //     }
    // }
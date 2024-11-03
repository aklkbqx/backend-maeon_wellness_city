import { Elysia, t } from 'elysia'
import { chromium, Browser, Page } from '@playwright/test'
import { config } from './config'

// Global browser instance
let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
    if (!browser) {
        browser = await chromium.launch({
            headless: config.browser.headless,
            executablePath: config.browser.executablePath,
            args: config.browser.args
        });

        if (config.debug) {
            console.log('Browser initialized with config:', {
                headless: config.browser.headless,
                executablePath: config.browser.executablePath,
                args: config.browser.args
            });
        }
    }
    return browser;
}

const app = new Elysia()
    .get('/health', () => {
        return {
            status: 'ok',
            config: config.debug ? {
                headless: config.browser.headless,
                ui: process.env.PLAYWRIGHT_SHOW_UI === 'true'
            } : undefined
        }
    })
    .post('/screenshot', async ({ body }) => {
        let page: Page | null = null;
        try {
            console.log('Taking screenshot of:', body.url);
            const browser = await getBrowser();
            page = await browser.newPage({
                viewport: { width: 1280, height: 800 }
            });

            await page.goto(body.url, {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            const screenshot = await page.screenshot({ fullPage: true });

            return new Response(screenshot, {
                headers: {
                    'Content-Type': 'image/png'
                }
            });

        } catch (error) {
            console.error('Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            };
        } finally {
            if (page) await page.close();
        }
    }, {
        body: t.Object({
            url: t.String()
        })
    })
    // Endpoint สำหรับ reset credit
    .post('/reset-openslip-credit', async ({ body }) => {
        let page: Page | null = null;
        const startTime = Date.now();

        try {
            const browser = await getBrowser();
            const context = await browser.newContext({
                viewport: config.viewport
            });

            page = await context.newPage();

            if (config.debug) {
                page.on('console', msg => console.log('Browser console:', msg.text()));
                console.log('Starting credit reset process');
            }

            // Set cookie
            await context.addCookies([{
                name: "token",
                value: body.token,
                domain: "dev.openslipverify.com",
                path: "/"
            }]);

            // Navigate with timeout
            await page.goto("https://dev.openslipverify.com/Dashboard", {
                waitUntil: 'networkidle',
                timeout: config.timeouts.navigation
            });

            const buttonSelector = 'button[class="py-3 self-end px-4 inline-flex gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-blue-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-blue-500"]';
            let currentValue = 0;

            for (let i = 0; i < 20; i++) {
                await page.reload();
                await page.waitForLoadState('networkidle');

                const value = await page.evaluate(() => {
                    const elements = document.querySelectorAll('p[class="text-3xl font-semibold text-blue-600"]');
                    return elements.length >= 3 ? elements[2].textContent : null;
                });

                if (config.debug) {
                    console.log(`Loop ${i + 1}: Current value = ${value}`);
                }

                if (value === '20') {
                    currentValue = 20;
                    break;
                }

                await page.click(buttonSelector, {
                    timeout: config.timeouts.action
                });
                await page.waitForTimeout(1000);
            }

            const duration = Date.now() - startTime;
            return {
                success: true,
                credits: currentValue,
                duration: config.debug ? `${duration}ms` : undefined
            };

        } catch (error) {
            console.error('Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            };
        } finally {
            if (page) await page.close();
        }
    }, {
        body: t.Object({
            token: t.String()
        })
    });

// Cleanup on exit
process.on('SIGTERM', async () => {
    if (browser) {
        await browser.close();
        browser = null;
    }
    process.exit(0);
});

// Error handler
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    if (config.debug) {
        console.error('Stack:', error.stack);
    }
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Playwright service running on port ${port}`);

export type App = typeof app;
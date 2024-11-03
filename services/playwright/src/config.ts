export const config = {
    browser: {
        headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
        executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            ...(process.env.PLAYWRIGHT_SHOW_UI === 'true' ? ['--display=:99'] : [])
        ]
    },
    viewport: {
        width: parseInt(process.env.PLAYWRIGHT_VIEWPORT_WIDTH || '1280'),
        height: parseInt(process.env.PLAYWRIGHT_VIEWPORT_HEIGHT || '800')
    },
    timeouts: {
        navigation: parseInt(process.env.PLAYWRIGHT_NAVIGATION_TIMEOUT || '30000'),
        action: parseInt(process.env.PLAYWRIGHT_ACTION_TIMEOUT || '5000')
    },
    debug: process.env.PLAYWRIGHT_DEBUG === 'true'
};
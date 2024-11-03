import axios from "axios";
import Elysia, { t } from "elysia";

import { load } from 'cheerio';

const CheckVersionSchema = t.Object({
    platform: t.Enum({ ios: 'ios', android: 'android' }),
    currentVersion: t.String(),
    bundleId: t.String()
});

const getIOSVersion = async (bundleId: string): Promise<string> => {
    try {
        const response = await axios.get(
            `https://itunes.apple.com/lookup?bundleId=${bundleId}`
        );
        const data = response.data;
        if (data.results && data.results.length > 0) {
            return data.results[0].version;
        }
        throw new Error('App not found');
    } catch (error) {
        console.error('Error fetching iOS version:', error);
        throw error;
    }
};

const getAndroidVersion = async (bundleId: string): Promise<string> => {
    try {
        const response = await axios.get(
            `https://play.google.com/store/apps/details?id=${bundleId}`
        );
        const $ = load(response.data);
        const version = $('[itemprop="version"]').text().trim();
        if (!version) {
            throw new Error('Version not found');
        }
        return version;
    } catch (error) {
        console.error('Error fetching Android version:', error);
        throw error;
    }
};

const compareVersions = (current: string, target: string): boolean => {
    const current_parts = current.split('.').map(Number);
    const target_parts = target.split('.').map(Number);

    for (let i = 0; i < Math.max(current_parts.length, target_parts.length); i++) {
        const current_part = current_parts[i] || 0;
        const target_part = target_parts[i] || 0;
        if (current_part !== target_part) {
            return current_part < target_part;
        }
    }
    return false;
};

const app = new Elysia()
    .post('/check-version', async ({ body }) => {
        try {
            let storeVersion: string;
            let storeUrl: string;

            if (body.platform === 'ios') {
                storeVersion = await getIOSVersion(body.bundleId);
                storeUrl = `https://apps.apple.com/app/id${body.bundleId}`;
            } else {
                storeVersion = await getAndroidVersion(body.bundleId);
                storeUrl = `https://play.google.com/store/apps/details?id=${body.bundleId}`;
            }

            const needsUpdate = compareVersions(body.currentVersion, storeVersion);

            return {
                success: true,
                data: {
                    needsUpdate,
                    forceUpdate: false, // ไม่สามารถเช็ค force update จาก store ได้โดยตรง
                    latestVersion: storeVersion,
                    storeUrl,
                    releaseNotes: null // ไม่สามารถดึง release notes ได้โดยตรง
                }
            };
        } catch (error) {
            console.error('Version check error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }, {
        body: CheckVersionSchema
    })

export default app;
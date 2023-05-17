import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { dbPool, checkInput, createJWT } from '$lib/server/global';
import { isIpRecognised, hasUUIDGotIp, createIpEntry, updateIpEntry } from '$lib/server/ipchecks';
import { scryptSync, timingSafeEqual } from 'crypto';
import type { AuthResult, LoginResult, StaffIPInfo } from '$lib/types';

export const load = (async ({ locals }) => {
    const sessionUser: AuthResult = locals.user;

    if (sessionUser) {
        throw redirect(303, '/');
    }

    return {
        sessionUser
    };
}) satisfies PageServerLoad;

export const actions = {
    // Login the user
    default: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());

        // Form validation
        if (!formData.username || !formData.pwd) {
            return fail(400, { success: false, message: "Form is in-complete."});
        }

        if (!checkInput(formData.username.toString())) {
            return fail(400, { success: false, message: "Your input contains disallowed characters. Please try again."});
        }

        let userInfo = await getUserInfo(formData.username.toString());
        if (!userInfo) {
            return fail(400, { success: false, message: "Invalid username or password."});
        }

        let [dbSalt, dbHash] = userInfo.password.split(':'); // Get salt and hash from DB
        let hashedBuffer = scryptSync(formData.pwd.toString(), dbSalt, 64) // Generate what the hash should be

        // Setup the buffer and check the match
        let keyBuffer = Buffer.from(dbHash, 'hex');
        let match = timingSafeEqual(hashedBuffer, keyBuffer);

        if (!match) {
            return fail(400, { success: false, message: "Invalid username or password."});
        }

        // Check for IP
        let hasIp = await hasUUIDGotIp(userInfo.uuid);
        if (!hasIp) {
            return fail(400, { success:false, message: "Security check failed. Please contact an administrator."})
        }

        let ipInfo = await isIpRecognised(userInfo.uuid, event.getClientAddress());
        if (!ipInfo) {
            let newInfo: StaffIPInfo = { id: -1, uuid: userInfo.uuid, ip: event.getClientAddress(), initial: false, panel_acknowledged: true, panel_verified: false, game_verified: false };
            await createIpEntry(newInfo);

            throw redirect(303, "/login/verify?ingame=false");
        }

        if (!ipInfo.panel_verified) {
            ipInfo.panel_acknowledged = true;
            await updateIpEntry(ipInfo);
            throw redirect(303, "/login/verify?ingame=true");
        }

        let token = createJWT(userInfo, ipInfo.ip);
        if (token == "null") {
            return fail(400, { success: false, message: "Sign-in failed. Please contact an administrator."});
        }

        event.cookies.set('token', token, {
            httpOnly: true,
            path: '/',
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24
        });

        throw redirect(303, "/");
    }
} satisfies Actions;

async function getUserInfo(username: string): Promise<LoginResult | null> {
    let conn;
    let info: LoginResult;

    try {
        conn = await dbPool.getConnection();

        let result = await conn.query("SELECT * FROM `staffog_web` WHERE `username`=?", [username]);
        info = (result[0] as LoginResult)

        if (!info) return null;

    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }

    return info;
}
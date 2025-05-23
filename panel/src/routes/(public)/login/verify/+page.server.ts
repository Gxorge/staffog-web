import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { dbPool, getUUIDFromName, checkInput } from '$lib/server/global';
import { isIpRecognised, updateIpEntry } from '$lib/server/ipchecks';
import { scryptSync, randomBytes } from 'crypto';
import type { AuthResult, StaffIPInfo } from '$lib/types';
import type { PageServerLoad } from '../$types';

export const load = (async ({ locals }) => {
    const sessionUser: AuthResult = locals.user;

    if (sessionUser) {
        redirect(303, '/');
    }

    return {
        sessionUser
    };
}) satisfies PageServerLoad;

export const actions = {
    // Activate the user
    default: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());

        // Form validation
        if (!formData.username || !formData.actcode) {
            return fail(400, { success: false, message: "Form is in-complete."});
        }

        if (!checkInput(formData.username.toString()) || !checkInput(formData.actcode.toString())) {
            return fail(400, { success: false, message: "Your input contains disallowed characters. Please try again."});
        }

        let uuid = await getUUIDFromName(formData.username.toString());
        if (!uuid) {
            return fail(400, { success: false, message: formData.username.toString() + " has never joined the server."})
        }

        let actAdmin = await checkActCode(uuid, formData.actcode.toString())
        if (actAdmin == null) {
            return fail(400, { success: false, message: "Invalid activation code."})
        }

        let ipInfo = await isIpRecognised(uuid, event.getClientAddress());
        if (!ipInfo) {
            return fail(400, { success: false, message: "Security check failed (IP not recognized). Please contact an administrator."})
        }

        if (!ipInfo.panel_acknowledged) {
            return fail(400, { success: false, message: "Security check failed (code 2). Please contact an administrator."})
        }

        if (!ipInfo.game_verified) {
            return fail(400, { success: false, message: "Security check failed (code 3). Please contact an administrator."})
        }

        if (ipInfo.panel_verified) {
            return fail(400, { success: false, message: "Your IP does not need to be re-verified."})
        }

        await removeActCode(uuid);

        ipInfo.panel_verified = true;
        await updateIpEntry(ipInfo);

        redirect(303, "/login?success=true");
    }
} satisfies Actions;

async function checkActCode(uuid: string, code: string): Promise<number | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();

        let result = await conn.query("SELECT `code`, `admin` FROM `staffog_linkcode` WHERE `uuid`=?", uuid);
        let dbCode = result[0].code;

        if (!dbCode) return null;
        console.log(result[0].admin);

        return dbCode == code ? result[0].admin : null;
    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }
}

async function removeActCode(uuid: string) {
    let conn;

    try {
        conn = await dbPool.getConnection();

        await conn.query("DELETE FROM `staffog_linkcode` WHERE `uuid`=?", uuid);
    } catch (e) {
        console.log(e);
    } finally {
        if (conn) conn.release();
    }
}

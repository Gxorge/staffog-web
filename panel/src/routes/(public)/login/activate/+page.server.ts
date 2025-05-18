import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { dbPool, getUUIDFromName, checkInput } from '$lib/server/global';
import { isIpRecognised, updateIpEntry } from '$lib/server/ipchecks';
import { scryptSync, randomBytes } from 'crypto';
import type { AuthResult } from '$lib/types';
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
        if (!formData.username || !formData.actcode || !formData.pwd || !formData.pwdrepeat) {
            return fail(400, { success: false, message: "Form is in-complete."});
        }

        if (!checkInput(formData.username.toString()) || !checkInput(formData.actcode.toString())) {
            return fail(400, { success: false, message: "Your input contains disallowed characters. Please try again."});
        }

        if (formData.pwd != formData.pwdrepeat) {
            return fail(400, { success: false, message: "Your passwords do not match."});
        }

        if (await doesUsernameExist(formData.username.toString())) {
            return fail(400, { success: false, message: "IGN has already been activated."})
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
            return fail(400, { success:false, message: "Security check failed (code 1). Please contact an administrator."})
        }

        if (!ipInfo.initial) {
            return fail(400, { success:false, message: "Security check failed (code 2). Please contact an administrator."})
        }

        // Let's create the user!
        const salt = randomBytes(16).toString('hex');
        let hashedPassword = scryptSync(formData.pwd.toString(), salt, 64).toString('hex');

        let createSuccess = await createUser(formData.username.toString(), uuid, hashedPassword, salt, actAdmin);
        if (!createSuccess) {
            return fail(400, { success: false, message: "Failed to activate your account. Please contact an administrator."})
        }

        await removeActCode(uuid);
        ipInfo.panel_acknowledged = true;
        ipInfo.panel_verified = true;
        await updateIpEntry(ipInfo);

        redirect(303, "/login?success=true");
    }
} satisfies Actions;

async function createUser(username: string, uuid: string, password: string, salt: string, admin: number): Promise<boolean> {
    let conn;

    try {
        conn = await dbPool.getConnection();

        await conn.query("INSERT INTO `staffog_web` (username, uuid, password, admin) VALUES (?,?,?,?);", [username, uuid, salt + ":" + password, admin]);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    } finally {
        if (conn) conn.release();
    }
}

async function doesUsernameExist(username: string): Promise<boolean> {
    let conn;

    try {
        conn = await dbPool.getConnection();

        let result = await conn.query("SELECT `id` FROM `staffog_web` WHERE `username`=?", [username]);
        let list = (result as Array<any>);

        if (list.length == 0) return false;

    } catch (e) {
        console.log(e);
        return true;
    } finally {
        if (conn) conn.release();
    }

    return true;
}

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
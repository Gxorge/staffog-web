import { checkInput, getAppeal, getUUIDFromName, submitAppeal } from '$lib/server/global.js';
import { getActivePunishments } from '$lib/server/punish.js';
import type { PunishEntry } from '$lib/types.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async (event) => {
        const data = await event.request.formData();
        let username = data.get('username');
        let refForm = data.get('ref');

        if (!username || !refForm) {
            return fail(400, { success: false, message: "Please enter your username and reference number." });
        }

        username = username.toString();
        
        if (!Number(refForm)) {
            return fail(400, { success: false, message: "Please enter a valid reference number." });
        }

        let ref = Number(refForm);

        if (!checkInput(username)) {
            return fail(400, { success: false, message: "Please enter a valid username." });
        }

        let uuid = await getUUIDFromName(username);
        if (!uuid) {
            return fail(400, { success: false, message: "Please check your username, have you ever joined the server?" });
        }

        let appeal = await getAppeal(uuid, ref);
        if (!appeal) {
            return fail(400, { success: false, message: "Could not find your appeal. Please check your username and reference number." });
        }

        return { success: true, appeal: appeal, username: username }
    }
}
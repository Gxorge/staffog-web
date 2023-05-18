import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AuthResult, RevokePunishmentTask } from '$lib/types';
import { queueTask } from '$lib/server/global';

let id: number;
let user: AuthResult;

export const load = (async ({ locals, params }) => {
    const sessionUser: AuthResult = locals.user;

    if (!sessionUser) {
        throw redirect(303, '/login');
    }

    if (sessionUser.ip != locals.userIp) {
        throw redirect(303, '/login/out/silent');
    }

    if (!sessionUser.admin) {
        throw error(403, "Unauthorized.");
    }

    id = Number(params.slug);
    user = sessionUser;

    return {
        sessionUser
    };
}) satisfies PageServerLoad;

export const actions = {
    // Login the user
    default: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());

        // Form validation
        if (!formData.reason) {
            return fail(400, { success: false, message: "Form is in-complete."});
        }
        
        if (!id || !user) {
            return fail(500, { success: false, message: "Server was missing data."});
        }
        
        let data: RevokePunishmentTask = {
            type: "MUTE",
            id: id,
            removedName: user.username,
            removedUuid: user.uuid,
            removedReason: formData.reason.toString(),
            removedTime: new Date().getTime(),
        };


        if (await queueTask("unpunish", JSON.stringify(data)) == false) {
            return fail(500, { sucess: false, message: "Server failed to queue unpunish task."})
        }

        throw redirect(303, '/' + data.type.toLowerCase() + 's/' + id + '?result=revoke')
    }
} satisfies Actions;
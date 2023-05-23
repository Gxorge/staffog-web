import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AuthResult, RevokePunishmentTask } from '$lib/types';
import { queueTask } from '$lib/server/global';
import { onPageLoadSecurityCheck } from '$lib/server/user';
import { revokePunishment } from '$lib/server/punish';

let id: number;
let user: AuthResult;

export const load = (async ({ locals, params }) => {
    const sessionUser: AuthResult = locals.user;
    let check = await onPageLoadSecurityCheck(sessionUser, locals.userIp);
    if (!check.allow) {
        if (check.logout) {
            throw redirect(303, '/login/out/silent');
        } else {
            throw redirect(303, '/login');
        }
    }

    if (!sessionUser.admin) {
        throw error(403, "Unauthorized.")
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
        
        if (await revokePunishment("staffog_mute", id, user.uuid, user.username + " (via Panel)", formData.reason.toString()) == false) {
            return fail(500, { sucess: false, message: "Server failed to revoke punishment."})
        }
        
        let data: RevokePunishmentTask = {
            type: "MUTE",
            id: id,
        };

        await queueTask("unpunish", JSON.stringify(data));
        throw redirect(303, '/' + data.type.toLowerCase() + 's/' + id + '?result=revoke')
    }
} satisfies Actions;
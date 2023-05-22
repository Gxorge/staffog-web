import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AuditPunishEditReason, AuthResult, PunishEntry, RevokePunishmentTask } from '$lib/types';
import { onPageLoadSecurityCheck } from '$lib/server/user';
import { editPunishmentReason, getPunishment } from '$lib/server/punish';
import { addToAuditLog } from '$lib/server/audit';

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


        let entry = await getPunishment("staffog_ban", id);
        if (!entry) {
            return fail(400, { success: false, message: "Invalid punishment id."});
        }
    

        let auditEntry: AuditPunishEditReason = {
            type: "BAN",
            id: id,
            user: user.uuid,
            oldReason: entry.reason,
            newReason: formData.reason.toString()
        };


        if (await editPunishmentReason("staffog_ban", id, formData.reason.toString()) == false) {
            return fail(500, { sucess: false, message: "Server failed to edit reason."})
        }

        await addToAuditLog("punish_edit", JSON.stringify(auditEntry));

        throw redirect(303, '/bans/' + id + '?result=edit')
    }
} satisfies Actions;
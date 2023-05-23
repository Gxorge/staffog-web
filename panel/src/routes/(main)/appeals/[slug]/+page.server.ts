import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AuthResult, RevokePunishmentTask } from '$lib/types';
import { onPageLoadSecurityCheck } from '$lib/server/user';
import { closeAppeal, getAppealFromId } from '$lib/server/appeal';
import { getPunishment, revokePunishment } from '$lib/server/punish';
import { queueTask } from '$lib/server/global';

let appealId: number;
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

    appealId = Number(params.slug);

    return {
        sessionUser
    };
}) satisfies PageServerLoad;

export const actions = {
    accept: async (event) => {
        const data = await event.request.formData();
        let comments = data.get('comments');

        if (!comments) {
            return fail(400, { success: false, message: "Please enter a comment. "})
        }

        let appeal = await getAppealFromId(appealId);
        if (!appeal) {
            return fail(500, { success: false, message: "Server failed to get appeal data."})
        }

        let punishment = await getPunishment((appeal.type == "Ban" ? "staffog_ban" : "staffog_mute"), appeal.pid);
        if (!punishment) {
            return fail(500, { success: false, message: "Server failed to get punishment data."})
        }

        if (await closeAppeal(appealId, 1, comments.toString()) == false) {
            return fail(500, { success: false, message: "Server failed to close appeal."})
        }

        if (await revokePunishment((appeal.type == "Ban" ? "staffog_ban" : "staffog_mute"), appeal.pid, appeal.assigned, appeal.assigned_name + " (via Appeals)", comments.toString()) == false) {
            throw redirect(303, '/appeals/' + appealId + '?message=closedrevokefail');
        }

        let revokeTask: RevokePunishmentTask = {
            type: appeal.type.toUpperCase(),
            id: Number(punishment.id)
        };

        await queueTask("unpunish", JSON.stringify(revokeTask));
        throw redirect(303, '/appeals/' + appealId + '?message=closed');
    },

    reject: async (event) => {
        const data = await event.request.formData();
        let comments = data.get('comments');

        if (!comments) {
            return fail(400, { success: false, message: "Please enter a comment. "})
        }

        if (await closeAppeal(appealId, 0, comments.toString()) == false) {
            return fail(500, { success: false, message: "Server failed to close appeal."})
        }

        throw redirect(303, '/appeals/' + appealId + '?message=closed');
    }
}
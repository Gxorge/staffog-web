import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AuthResult, RevokePunishmentTask } from '$lib/types';
import { onPageLoadSecurityCheck } from '$lib/server/user';
import { claimAppeal, closeAppeal, getAppealFromId, isAppealClaimed, unclaimAppeal } from '$lib/server/appeal';
import { getPunishment, revokePunishment } from '$lib/server/punish';
import { queueTask } from '$lib/server/global';

export const load = (async ({ locals, params }) => {
    const sessionUser: AuthResult = locals.user;
    let check = await onPageLoadSecurityCheck(sessionUser, locals.userIp);

    if (!check.allow) {
        if (check.logout) {
            redirect(303, '/login/out/silent');
        } else {
            redirect(303, '/login');
        }
    }

    if (!sessionUser.admin) {
        error(403, "Unauthorized.");
    }

    return {
        sessionUser
    };
}) satisfies PageServerLoad;

export const actions = {
    back: async (event) => {
        redirect(303, '/appeals/');
    },

    claim: async (event) => {
        let appealId = Number(event.params.slug);

        if (await isAppealClaimed(appealId) == true) {
            return fail(400, { success: false, message: "Appeal is already claimed."})
        }

        if (await claimAppeal(appealId, event.locals.user.uuid) == false) {
            return fail(500, { success: false, message: "Server failed to claim appeal."})
        }

        redirect(303, '/appeals/' + appealId + '?message=claimed');
    },

    accept: async (event) => {
        let appealId = Number(event.params.slug);
        const data = await event.request.formData();
        let comments = data.get('comments');

        if (!comments) {
            return fail(400, { success: false, closeMessage: "Please enter a comment. "})
        }

        let appeal = await getAppealFromId(appealId);
        if (!appeal) {
            return fail(500, { success: false, closeMessage: "Server failed to get appeal data."})
        }

        let punishment = await getPunishment((appeal.type == "Ban" ? "staffog_ban" : "staffog_mute"), appeal.pid);
        if (!punishment) {
            return fail(500, { success: false, closeMessage: "Server failed to get punishment data."})
        }

        if (await closeAppeal(appealId, 1, comments.toString()) == false) {
            return fail(500, { success: false, closeMessage: "Server failed to close appeal."})
        }

        if (await revokePunishment((appeal.type == "Ban" ? "staffog_ban" : "staffog_mute"), appeal.pid, appeal.assigned, appeal.assigned_name + " (via Appeals)", comments.toString()) == false) {
            redirect(303, '/appeals/' + appealId + '?message=closedrevokefail');
        }

        let revokeTask: RevokePunishmentTask = {
            type: appeal.type.toUpperCase(),
            id: Number(punishment.id)
        };

        await queueTask("unpunish", JSON.stringify(revokeTask));
        redirect(303, '/appeals/' + appealId + '?message=closed');
    },

    reject: async (event) => {
        let appealId = Number(event.params.slug);
        const data = await event.request.formData();
        let comments = data.get('comments');

        if (!comments) {
            return fail(400, { success: false, closeMessage: "Please enter a comment. "})
        }

        if (await closeAppeal(appealId, 0, comments.toString()) == false) {
            return fail(500, { success: false, closeMessage: "Server failed to close appeal."})
        }

        redirect(303, '/appeals/' + appealId + '?message=closed');
    }
}
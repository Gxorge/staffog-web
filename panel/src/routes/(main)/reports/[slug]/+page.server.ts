import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AuthResult } from '$lib/types';
import { onPageLoadSecurityCheck } from '$lib/server/user';
import { claimReport, closeReport, isReportClaimed } from '$lib/server/report';

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

    return {
        sessionUser
    };
}) satisfies PageServerLoad;

export const actions = {
    back: async (event) => {
        throw redirect(303, '/reports/');
    },

    claim: async (event) => {
        let reportId = Number(event.params.slug);

        if (await isReportClaimed(reportId) == true) {
            return fail(400, { success: false, message: "Report is already claimed."})
        }

        if (await claimReport(reportId, event.locals.user.uuid) == false) {
            return fail(500, { success: false, message: "Server failed to claim report."})
        }

        throw redirect(303, '/reports/' + reportId + '?message=claimed');
    },

    accept: async (event) => {
        let reportId = Number(event.params.slug);
        const data = await event.request.formData();
        let comments = data.get('comments');

        if (!comments) {
            return fail(400, { success: false, closeMessage: "Please enter a comment. "})
        }

        if (await closeReport(reportId, 1, comments.toString()) == false) {
            return fail(500, { success: false, closeMessage: "Server failed to close report."})
        }

        throw redirect(303, '/reports/' + reportId + '?message=closed');
    },

    reject: async (event) => {
        let reportId = Number(event.params.slug);
        const data = await event.request.formData();
        let comments = data.get('comments');

        if (!comments) {
            return fail(400, { success: false, closeMessage: "Please enter a comment. "})
        }

        if (await closeReport(reportId, 0, comments.toString()) == false) {
            return fail(500, { success: false, closeMessage: "Server failed to close report."})
        }

        throw redirect(303, '/reports/' + reportId + '?message=closed');
    }
}
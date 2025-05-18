import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AuthResult } from '$lib/types';
import { onPageLoadSecurityCheck } from '$lib/server/user';

export const load = (async ({ locals }) => {
    const sessionUser: AuthResult = locals.user;
    let check = await onPageLoadSecurityCheck(sessionUser, locals.userIp);
    if (!check.allow) {
        if (check.logout) {
            redirect(303, '/login/out/silent');
        } else {
            redirect(303, '/login');
        }
    }

    return {
        sessionUser
    };
}) satisfies PageServerLoad;
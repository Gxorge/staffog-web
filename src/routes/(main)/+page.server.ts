import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AuthResult } from '$lib/types';

export const load = (async ({ locals }) => {
    const sessionUser: AuthResult = locals.user;

    if (!sessionUser) {
        throw redirect(303, '/login');
    }

    if (sessionUser.ip != locals.userIp) {
        throw redirect(303, '/login/out/silent');
    }

    return {
        sessionUser
    };
}) satisfies PageServerLoad;
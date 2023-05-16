import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AuthResult } from '$lib/types';

export const load = (async ({ locals }) => {
    const sessionUser: AuthResult = locals.user;

    if (!sessionUser) {
        throw redirect(303, '/login');
    }

    return {
        sessionUser
    };
}) satisfies PageServerLoad;
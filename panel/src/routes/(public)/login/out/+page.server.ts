import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load = (async ({ cookies }) => {
    cookies.set('token', '', {
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'strict',
        maxAge: 0
    });

    redirect(302, "/login?success=out");
}) satisfies PageServerLoad;
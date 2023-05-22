import type { Handle } from '@sveltejs/kit';
import { verifyJWT } from '$lib/server/global';

export const handle = (async ({ event, resolve }) => {
    const authCookie = event.cookies.get('token');
    if (authCookie) {
        try {
            const userInfo = verifyJWT(authCookie);
            if (userInfo == null) {
                throw new Error("JWT is null")
            }

            const sessionUser = userInfo;

            event.locals.user = sessionUser;
            event.locals.userIp = event.getClientAddress();

        } catch (e) {
            console.log(e);
        }
    }

    return await resolve(event);
}) satisfies Handle;
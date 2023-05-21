import { apiCanAccess } from '$lib/server/global';
import { isActivelyPunished } from '$lib/server/punish.js';

export async function GET({ cookies, params }) {
    if (await apiCanAccess(cookies.get('token')) == false) {
        return new Response("Unauthorized.", { status: 401 });
    }

    let isPunished = await isActivelyPunished(params.slug);
    if (!isPunished) {
        return new Response("Server error", { status: 500 });
    }

    return new Response(isPunished.toString(), { status: 200});

}
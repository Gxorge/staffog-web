import { getAppealFromId } from '$lib/server/appeal.js';
import { apiCanAdminAccess } from '$lib/server/global';

export async function GET({ cookies, params }) {
    if (await apiCanAdminAccess(cookies.get('token')) == false) {
        return new Response("Unauthorized.", { status: 401 });
    }

    if (!Number(params.slug)) {
        return new Response("ID should be a number.", { status: 400 });
    }

    let entry = await getAppealFromId(Number(params.slug));

    if (entry == null) {
        return new Response("ID of " + params.slug + " does not exist.", { status: 400 });
    }

    let toReturn = JSON.stringify(entry, (key, value) => 
    typeof value === 'bigint'
        ? value.toString()
        : value);

    return new Response(toReturn, { status: 200});

}
import { apiCanAccess, getNameFromUUID, getUUIDFromName } from '$lib/server/global';

export async function GET({ cookies, params }) {
    if (await apiCanAccess(cookies.get('token')) == false) {
        return new Response("Unauthorized.", { status: 401 });
    }

    let name = await getUUIDFromName(params.slug);

    if (name == null) {
        return new Response("Player does not exist.", { status: 400 });
    }

    return new Response(name, { status: 200 });

}
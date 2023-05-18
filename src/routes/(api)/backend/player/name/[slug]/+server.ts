import { apiCanAccess, getNameFromUUID } from '$lib/server/global';

export async function GET({ cookies, params }) {
    if (await apiCanAccess(cookies.get('token')) == false) {
        return new Response("Unauthorized.", { status: 401 });
    }

    let name = await getNameFromUUID(params.slug);

    if (name == null) {
        return new Response("Player does not exist.", { status: 400 });
    }

    return new Response(name, { status: 200 });

}
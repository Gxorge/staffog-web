import { getTopTen, apiCanAccess } from '$lib/server/global';

export async function GET({ cookies }) {
    if (await apiCanAccess(cookies.get('token')) == false) {
        return new Response("Unauthorized.", { status: 401 });
    }

    let entry = await getTopTen("staffog_mute");

    if (entry == null) {
        return new Response("Server error.", { status: 500});
    }

    let toReturn = JSON.stringify(entry, (key, value) => 
    typeof value === 'bigint'
        ? value.toString()
        : value);

    return new Response(toReturn, { status: 200});

}
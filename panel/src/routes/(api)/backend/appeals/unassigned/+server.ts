import { getUnassignedAppeals } from '$lib/server/appeal.js';
import { apiCanAdminAccess } from '$lib/server/global';

export async function GET({ cookies }) {
    if (await apiCanAdminAccess(cookies.get('token')) == false) {
        return new Response("Unauthorized.", { status: 401 });
    }

    let entry = await getUnassignedAppeals();

    if (entry == null) {
        return new Response("Server error.", { status: 500});
    }

    let toReturn = JSON.stringify(entry, (key, value) => 
    typeof value === 'bigint'
        ? value.toString()
        : value);

    return new Response(toReturn, { status: 200});
}
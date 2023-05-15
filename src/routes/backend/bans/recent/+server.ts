import { error } from '@sveltejs/kit';
import { getTopTen } from '$lib/server/global';

export async function GET({url}) {

    let entry = await getTopTen("staffog_ban");

    if (entry == null) {
        return new Response("Server error.", { status: 500});
    }

    let toReturn = JSON.stringify(entry, (key, value) => 
    typeof value === 'bigint'
        ? value.toString()
        : value);

    return new Response(toReturn, { status: 200});

}
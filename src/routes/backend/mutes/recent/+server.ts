import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTopTen } from '$lib/server/global';
import type { PunishEntry } from '$lib/types';

export async function GET({url}) {

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
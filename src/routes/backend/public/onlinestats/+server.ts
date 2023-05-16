import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getOnlineStats } from '$lib/server/global';

export async function GET({url}) {

    let entry = await getOnlineStats();

    if (entry == null) {
        return new Response("Server error.", { status: 500});
    }

    let toReturn = JSON.stringify(entry);

    return new Response(toReturn, { status: 200});

}
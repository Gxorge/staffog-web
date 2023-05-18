import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type {PunishEntry} from '$lib/types';

export const load = async ({ params, fetch, }) => {

    const resBan = await fetch("/backend/bans/" + params.slug);
    let ban: PunishEntry;

    if (resBan.status == 200) {
        ban = await resBan.json();
    } else {
        throw error(404, "Punishment not found.")
    }

    return {
        ban
    };
}
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { PunishEntry, } from '$lib/types';

export const load = async ({ params, fetch, }) => {

    const resMute = await fetch("/backend/mutes/" + params.slug);
    let mute: PunishEntry;

    if (resMute.status == 200) {
        mute = await resMute.json();
    } else {
        throw error(404, "Punishment not found.")
    }

    return {
        mute
    };
}
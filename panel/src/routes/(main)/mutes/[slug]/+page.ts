import { error } from '@sveltejs/kit';
import type { PunishEntry, } from '$lib/types';

export const load = async ({ params, fetch, url }) => {

    let paramResult = url.searchParams.get('result');

    const resMute = await fetch("/backend/mutes/" + params.slug);
    let mute: PunishEntry;

    if (resMute.status == 200) {
        mute = await resMute.json();
    } else {
        error(404, "Punishment not found.");
    }

    return {
        mute, paramResult
    };
}
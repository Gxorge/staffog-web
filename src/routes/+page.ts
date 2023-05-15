import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { PunishEntry } from '$lib/types';

export const load = async ({ params, fetch }) => {

    const resBans = await fetch("/backend/bans/recent");
    let recentBans: Array<PunishEntry>;

    if (resBans.status == 200) {
        recentBans = await resBans.json();
    } else {
        throw error(500, "Could not load recent bans.")
    }

    const resMutes = await fetch("/backend/mutes/recent");
    let recentMutes: Array<PunishEntry>;

    if (resMutes.status == 200) {
        recentMutes = await resMutes.json();
    } else {
        throw error(500, "Could not load recent mutes.")
    }

    return {
        recentBans, recentMutes
    };
}
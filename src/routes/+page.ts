import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { OnlineStats, PunishEntry, PunishStats } from '$lib/types';

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

    const resStats = await fetch("/backend/public/onlinestats");
    let onlineStats: OnlineStats;
    if (resStats.status == 200) {
        onlineStats = await resStats.json();
    } else {
        throw error(500, "Could not load online stats.")
    }

    const resPunStats = await fetch("/backend/punish/stats");
    let punishStats: PunishStats;
    if (resPunStats.status == 200) {
        punishStats = await resPunStats.json();
    } else {
        throw error(500, "Could not load punish stats.")
    }

    return {
        recentBans, recentMutes, onlineStats, punishStats
    };
}
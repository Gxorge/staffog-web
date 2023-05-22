import { error } from '@sveltejs/kit';
import type {OnlineStats, PunishEntry} from '$lib/types';

export const load = async ({ params, fetch, }) => {

    const resBan = await fetch("/backend/bans/" + params.slug);
    let ban: PunishEntry;

    if (resBan.status == 200) {
        ban = await resBan.json();
    } else {
        throw error(404, "Punishment not found.");
    }

    const resOnline = await fetch("/backend/public/onlinestats");
    let online: OnlineStats;

    if (resOnline.status == 200) {
        online = await resOnline.json();
    } else {
        throw error(500, "Couldn't get server status.")
    }

    return {
        ban, online
    };
}
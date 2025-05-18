import { error } from '@sveltejs/kit';
import type {OnlineStats, PunishEntry} from '$lib/types';

export const load = async ({ params, fetch, }) => {

    const resMute = await fetch("/backend/mutes/" + params.slug);
    let mute: PunishEntry;

    if (resMute.status == 200) {
        mute = await resMute.json();
    } else {
        error(404, "Punishment not found.");
    }

    const resOnline = await fetch("/backend/public/onlinestats");
    let online: OnlineStats;

    if (resOnline.status == 200) {
        online = await resOnline.json();
    } else {
        error(500, "Couldn't get server status.");
    }

    return {
        mute, online
    };
}
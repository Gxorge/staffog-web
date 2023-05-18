import type { PlayerPunishments} from '$lib/types';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch, parent }) => {

    const {sessionUser} = await parent();
    
    const resPunishments = await fetch("/backend/punish/by/" + sessionUser.uuid);
    let punishments: PlayerPunishments;

    if (resPunishments.status != 200) {
        throw error(resPunishments.status, "Failed to get punsihments.");
    }

    punishments = await resPunishments.json();

    let totalPunishments = punishments.bans.length + punishments.mutes.length;

    return {
        punishments, totalPunishments, sessionUser
    };
}
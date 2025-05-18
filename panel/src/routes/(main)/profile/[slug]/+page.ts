import type { PlayerPunishments} from '$lib/types';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch, params }) => {

    let staffUuid = params.slug;

    let nameRres = await fetch("/backend/player/name/" + staffUuid);
    if (nameRres.status != 200) {
        error(nameRres.status, "Player is not found.");
    }
    let staffName = await nameRres.text();
    
    const resPunishments = await fetch("/backend/punish/by/" + staffUuid);
    let punishments: PlayerPunishments;

    if (resPunishments.status != 200) {
        error(resPunishments.status, "Failed to get punsihments.");
    }

    punishments = await resPunishments.json();

    let totalPunishments = punishments.bans.length + punishments.mutes.length;

    return {
        punishments, totalPunishments, staffName, staffUuid
    };
}
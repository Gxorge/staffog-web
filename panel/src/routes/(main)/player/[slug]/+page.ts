import { error } from '@sveltejs/kit';
import type { PlayerPunishments, PunishEntry, } from '$lib/types';

export const load = async ({ params, fetch }) => {

    let nameRres = await fetch("/backend/player/name/" + params.slug);
    if (nameRres.status != 200) {
        error(nameRres.status, "Player is not found.");
    }
    let name = await nameRres.text();
    

    const resPunishments = await fetch("/backend/punish/lookup/" + params.slug);
    let punishments: PlayerPunishments;

    if (resPunishments.status == 200) {
        punishments = await resPunishments.json();
    } else {
        punishments = { bans: [], mutes: []};
    }

    let isBanned = false;
    let isMuted = false;
    punishments.bans.forEach(entry => {
        if (entry.active) isBanned = true;
    });

    punishments.mutes.forEach(entry => {
        if (entry.active) isMuted = true;
    });

    return {
        punishments, isBanned, isMuted, name
    };
}
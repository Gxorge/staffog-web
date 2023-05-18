import { apiCanAccess } from '$lib/server/global';
import { getAllPunishments, getPunishStats } from '$lib/server/punish.js';
import type { PlayerPunishments, PunishStats } from '$lib/types';

export async function GET({ cookies, params }) {
    if (await apiCanAccess(cookies.get('token')) == false) {
        return new Response("Unauthorized.", { status: 401 });
    }

    let bans = await getAllPunishments("staffog_ban", params.slug, null);
    let mutes = await getAllPunishments("staffog_mute", params.slug, null);
    if (!bans || !mutes) {
        return new Response("Server error", { status: 500 });
    }

    let all: PlayerPunishments = { bans: bans, mutes: mutes };

    let toReturn = JSON.stringify(all, (key, value) => 
    typeof value === 'bigint'
        ? value.toString()
        : value);

    return new Response(toReturn, { status: 200});

}
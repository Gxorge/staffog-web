import { getPunishStats, apiCanAccess } from '$lib/server/global';
import type { PunishStats } from '$lib/types';

export async function GET({ cookies }) {
    if (await apiCanAccess(cookies.get('token')) == false) {
        return new Response("Unauthorized.", { status: 401 });
    }

    let bans = await getPunishStats("staffog_ban");
    let mutes = await getPunishStats("staffog_mute");

    if (bans == null || mutes == null) {
        return new Response("Server error.", { status: 500});
    }

    let totals: PunishStats = bans;
    totals.total += mutes.total;
    totals.month += mutes.month;
    totals.week += mutes.week;
    totals.day += mutes.day;

    let toReturn = JSON.stringify(totals);

    return new Response(toReturn, { status: 200});

}
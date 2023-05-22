import type { PlayerPunishments, PunishEntry, PunishStats } from "$lib/types";
import { dbPool, getNameFromUUID } from "./global";

export async function getPunishment(table: string, id: number): Promise<PunishEntry| null> {
    let conn;
    let entry;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT * FROM " + table + " WHERE `id`=?;", id);
        entry = result[0] as PunishEntry

        if (!entry) return null;

        let name = await getNameFromUUID(entry.uuid);
        if (name) entry.name = name;

    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }

    return entry;
}

export async function getAllPunishments(table: string, uuid: string): Promise<Array<PunishEntry> | null> {
    let conn;
    let list: Array<PunishEntry>;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT * FROM " + table + " WHERE `uuid`=? ORDER BY `id` DESC;", uuid);
        list = (result as Array<PunishEntry>);

        if (!list) return null;


        for (const entry of list) {
            let name = await getNameFromUUID(entry.uuid);
            if (!name) {
                entry.name = "Error";
                continue;
            }
            entry.name = name;
        }

    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }

    return list;
}

export async function getActivePunishments(uuid: string): Promise<Array<PunishEntry> | null> {
    let bans = await getAllPunishments("staffog_ban", uuid);
    let mutes = await getAllPunishments("staffog_mute", uuid);
    if (!bans || !mutes) {
        return null;
    }

    let all: PlayerPunishments = { bans: bans, mutes: mutes };

    let active: Array<PunishEntry> = [];

    let isPunished = false;
    for (let entry of all.bans) {
        if (entry.active) {
            entry.type = "Ban";
            active.push(entry);
            break;
        }
    }

    for (let entry of all.mutes) {
        if (entry.active) {
            entry.type = "Mute";
            active.push(entry);
            break;
        }
    }

    return active;
}
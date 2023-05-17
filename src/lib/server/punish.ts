import type { PunishEntry, PunishStats } from "$lib/types";
import { dbPool, getNameFromUUID } from "./global";

export async function getPunishStats(table: string): Promise<PunishStats | null> {
    let conn;
    let stats: PunishStats = { total: 0, month: 0, week: 0, day: 0};

    try {
        conn = await dbPool.getConnection();

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        const result = await conn.query("SELECT `time` FROM `" + table + "` WHERE `time` >= " + startOfMonth + ";")

        for (const entry of result) {
            let time = entry.time;
            if (time >= startOfMonth) {
              stats.month++;
              if (time >= startOfWeek) {
                stats.week++;
                if (time >= today) {
                  stats.day++;
                }
              }
            }
        }

        const countResult = await conn.query("SELECT COUNT(*) FROM `" + table + "`;");
        stats.total = Number(countResult[0]["COUNT(*)"]);

    } catch (e) {
        console.log(e);
    } finally {
        if (conn) conn.release();
    }

    return stats;
}

export async function getTopTen(table: string): Promise<Array<PunishEntry> | null> {
    let conn;
    let list: Array<PunishEntry>;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT * FROM " + table + " ORDER BY id DESC LIMIT 10;");
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

export async function getPunishment(table: string, id: number): Promise<PunishEntry| null> {
    let conn;
    let entry;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT * FROM " + table + " WHERE `id`=?", id);
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
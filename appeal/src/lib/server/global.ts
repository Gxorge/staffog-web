import type { AppealEntry } from "$lib/types";
import * as dotenv from "dotenv";
import * as mariadb from "mariadb"; 
import { getPunishment } from "./punish";
dotenv.config();

export const dbPool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    multipleStatements: false
});
const inputAllowed = /^[a-zA-Z0-9_]+$/;
const tokenSecret = process.env.TOKEN_SECRET;

export function checkInput(input: String): boolean {
    return Boolean(input.match(inputAllowed));
}

export async function getNameFromUUID(uuid: string): Promise<string | null> {
    let conn;
    let name: string;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT `name` FROM `staffog_history` WHERE `uuid`=? ORDER BY `id` DESC LIMIT 1;", uuid);
        name = result[0].name;

        if (!name) return null;

    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }

    return name;
}

export async function getUUIDFromName(name: string): Promise<string | null> {
    let conn;
    let uuid: string;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT `uuid` FROM `staffog_history` WHERE `name`=? ORDER BY `id` DESC LIMIT 1;", name);
        uuid = result[0].uuid;

        if (!uuid) return null;

    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }

    return uuid;
}

export async function submitAppeal(uuid: string, type: string, id: number, reason: string): Promise<string | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let currentTime = new Date().getTime();

        const result = await conn.query("INSERT INTO `staffog_appeal` (`uuid`, `time`, `type`, `pid`, `reason`) VALUES (?,?,?,?,?)", [uuid, currentTime, type, id, conn.escape(reason)]);
        
        return result.insertId;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function getAppeal(uuid: string, ref: number): Promise<AppealEntry | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT `id`, `uuid`, `type`, `pid`, `reason`, `open`, `verdict`, `comment` FROM `staffog_appeal` WHERE `uuid`=? AND `id`=?", [uuid, ref]);
        let entry = (result[0] as AppealEntry);

        if (!entry) return null;

        let punishment = await getPunishment((entry.type == "Ban" ? "staffog_ban" : "staffog_mute"), entry.pid)
        if (!punishment) return null;

        entry.punishment = punishment;

        return entry;
    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }
}

export async function isAppealForPunishmentActive(type: string, id: number): Promise<boolean> {
    let conn;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT * FROM `staffog_appeal` WHERE `type`=? AND `pid`=? AND `open`=1;", [type, id]);
        let list = (result as Array<any>);

        if (!list) return true;

        return list.length != 0;
        
    } catch (e) {
        console.log(e);
        return true;
    } finally {
        if (conn) conn.release();
    }
}

export async function canPunishmentBeAppealed(type: string, id: number): Promise<boolean> {
    let conn;

    try {
        conn = await dbPool.getConnection();

        const countResult = await conn.query("SELECT COUNT(*) FROM `staffog_appeal` WHERE `type`=? AND `pid`=?;", [type, id]);
        return Number(countResult[0]["COUNT(*)"]) < 2;
        
    } catch (e) {
        console.log(e);
        return false;
    } finally {
        if (conn) conn.release();
    }
}
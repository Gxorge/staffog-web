import * as dotenv from "dotenv";
import * as mariadb from "mariadb"; 
import * as jwt from "jsonwebtoken";
import type { AuthResult, LoginResult, OnlineStats, PunishEntry, PunishStats } from "../types";
dotenv.config();

export const dbPool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
});
const inputAllowed = /^[a-zA-Z0-9]+$/;
const tokenSecret = process.env.TOKEN_SECRET;

export function checkInput(input: String): boolean {
    return Boolean(input.match(inputAllowed));
}

export function createJWT(info: LoginResult, userIp: string): string {
    const jwtData = {
        id: info.id,
        uuid: info.uuid,
        username: info.username,
        admin: info.admin,
        ip: userIp
    };

    if (!tokenSecret) {
        return "null";
    }


    const token = jwt.sign(jwtData, tokenSecret, {
        expiresIn: '1d'
    });

    return token;
}

export function verifyJWT(token: string): AuthResult | null {
    if (!tokenSecret) {
        return null;
    }

    try {
        let decoded = jwt.verify(token, tokenSecret) as AuthResult;
        return decoded;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function apiCanAccess(token: string | undefined): Promise<boolean> {
    if (!token) {
        return false;
    }

    const userInfo = verifyJWT(token);
    if (!userInfo) {
        return false;
    }

    return true;
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

export async function getOnlineStats(): Promise<OnlineStats | null> {
    let conn;
    let stats: OnlineStats = { online: false, players: 0, staff: 0};
    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT * FROM `staffog_stat`;");

        for (const entry of result) {
            if (entry.name == "server_status") {
                stats.online = entry.stat == "online" ? true : false;
            } else if (entry.name == "player_count") {
                stats.players = Number(entry.stat);
            } else if (entry.name == "staff_count") {
                stats.staff = Number(entry.stat);
            }
        }

    } catch (e) {
        console.log(e);
    } finally {
        if (conn) conn.release();
    }

    return stats;
}

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
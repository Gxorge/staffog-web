import * as dotenv from "dotenv";
import * as mariadb from "mariadb"; 
import type { PunishEntry } from "../types";
dotenv.config();

const dbPool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
});

export async function getTopTen(table: string): Promise<Array<PunishEntry> | null> {
    let conn;
    let list: Array<PunishEntry>;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT * FROM " + table + " ORDER BY id DESC LIMIT 10");
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


import * as dotenv from "dotenv";
import * as mariadb from "mariadb"; 
import type { RowDataPacket } from "mysql2/promise";
import type { PunishEntry } from "../types";
dotenv.config();

const dbPool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
});

export async function getTopTenBans(): Promise<Array<PunishEntry> | null> {
    let conn;
    let list: Array<PunishEntry>;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT * FROM staffog_ban ORDER BY id DESC LIMIT 10");
        console.log(result)
        list = (result as Array<PunishEntry>);
        console.log(list);

        if (!list) return null;

    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }

    return list;
}


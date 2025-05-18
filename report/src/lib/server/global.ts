import * as dotenv from "dotenv";
import * as mariadb from "mariadb"; 
dotenv.config();

export const dbPool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    multipleStatements: false,
    allowPublicKeyRetrieval: true
});
const inputAllowed = /^[a-zA-Z0-9_]+$/;
const inputAllowedEvidence = /^[a-zA-Z0-9_-]+$/;

export function checkInput(input: String): boolean {
    return Boolean(input.match(inputAllowed));
}

export function checkInputEvidence(input: String): boolean {
    return Boolean(input.match(inputAllowedEvidence));
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

export async function queueTask(task: string, data: string): Promise<boolean> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        await conn.query("INSERT INTO `staffog_task` (`task`, `data`) VALUES (?,?)", [task, data]);

    } catch (e) {
        console.log(e);
        return false;
    }

    return true;
}

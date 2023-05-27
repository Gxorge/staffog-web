import { dbPool } from "./global";

export async function addToAuditLog(type: string, data: string): Promise<boolean> {
    let conn;
    try {
        conn = await dbPool.getConnection();
        let time = new Date().getTime();
        await conn.query("INSERT INTO `staffog_audit` (`type`, `data`, `time`) VALUES (?,?,?)", [type, data, time]);

    } catch(e) {
        console.log(e);
        return false;
    } finally {
        if (conn) conn.release();
    }

    return true;
}
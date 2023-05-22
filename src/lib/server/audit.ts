import { dbPool } from "./global";

export async function addToAuditLog(type: string, data: string): Promise<boolean> {
    let conn;
    try {
        conn = await dbPool.getConnection();
        await conn.query("INSERT INTO `staffog_audit` (`type`, `data`) VALUES (?,?)", [type, data]);

    } catch(e) {
        console.log(e);
        return false;
    } finally {
        if (conn) conn.release();
    }

    return true;
}
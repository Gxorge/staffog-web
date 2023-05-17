import { dbPool } from '$lib/server/global';
import type { StaffIPInfo } from '$lib/types';

export async function isIpRecognised(uuid: string, ip: string): Promise<StaffIPInfo | null> {
    let conn;
    let ipInfo;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT * FROM `staffog_staffip` WHERE `uuid`=? AND `ip`=?", [uuid, ip]);
        ipInfo = (result[0] as StaffIPInfo);
        if (!ipInfo) {
            return null;
        }

        return ipInfo;

    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }
}

export async function hasUUIDGotIp(uuid: string): Promise<boolean> {
    let conn;

    try {
        conn = await dbPool.getConnection();

        const result = await conn.query("SELECT * FROM `staffog_staffip` WHERE `uuid`=?", [uuid]);
        let list = (result as Array<any>);

        return list.length != 0;

    } catch (e) {
        console.log(e);
        return false;
    } finally {
        if (conn) conn.release();
    }
}   

export async function createIpEntry(info: StaffIPInfo) {
    let conn;
    let ipInfo;

    try {
        conn = await dbPool.getConnection();

        await conn.query("INSERT INTO `staffog_staffip` (`ip`, `uuid`, `initial`, `panel_acknowledged`, `panel_verified`, `game_verified`) VALUES (?, ?, ?, ?, ?, ?)", [info.ip, info.uuid, info.initial, info.panel_acknowledged, info.panel_verified, info.game_verified]);

    } catch (e) {
        console.log(e);
    } finally {
        if (conn) conn.release();
    }
}

export async function updateIpEntry(info: StaffIPInfo) {
    let conn;
    let ipInfo;

    try {
        conn = await dbPool.getConnection();

        await conn.query("UPDATE `staffog_staffip` SET `ip`=?, `uuid`=?, `initial`=?, `panel_acknowledged`=?, `panel_verified`=?, `game_verified`=? WHERE `id`=?", [info.ip, info.uuid, info.initial, info.panel_acknowledged, info.panel_verified, info.game_verified, info.id]);

    } catch (e) {
        console.log(e);
    } finally {
        if (conn) conn.release();
    }
}
import type { AuditUserDeactivated, AuthResult, LoginResult, SecurityCheckResult } from "$lib/types";
import { addToAuditLog } from "./audit";
import { dbPool } from "./global";
import { isActivelyPunished } from "./punish";

export async function onPageLoadSecurityCheck(user: AuthResult, ip: string): Promise<SecurityCheckResult> {
    if (!user) {
        return { allow: false, logout: false };
    }

    if (user.ip != ip) {
        return { allow: false, logout: true };
    }

    let isActive = await isUserActive(user.uuid);
    if (!isActive) {
        return { allow: false, logout: true };
    }

    let isPunished = await isActivelyPunished(user.uuid);
    if (isPunished == null) {
        return { allow: false, logout: true }
    }

    if (isPunished) {
        await deactiveUser(user.uuid, "System", "Failed security check: is punished.");
        return { allow: false, logout: true }; 
    }

    return { allow: true, logout: false };
}

export async function getUserInfoByName(username: string): Promise<LoginResult | null> {
    let conn;
    let info: LoginResult;

    try {
        conn = await dbPool.getConnection();

        let result = await conn.query("SELECT * FROM `staffog_web` WHERE `username`=?", [username]);
        info = (result[0] as LoginResult)

        if (!info) return null;

    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }

    return info;
}

export async function getUserInfoByUuid(uuid: string): Promise<LoginResult | null> {
    let conn;
    let info: LoginResult;

    try {
        conn = await dbPool.getConnection();

        let result = await conn.query("SELECT * FROM `staffog_web` WHERE `uuid`=?", [uuid]);
        info = (result[0] as LoginResult)

        if (!info) return null;

    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }

    return info;
}

export async function isUserActive(uuid: string): Promise<boolean> {
    let info = await getUserInfoByUuid(uuid);
    if (!info) {
        return false;
    }

    return info.active == 1;
}

export async function deactiveUser(uuid: string, by: string, reason: string) {
    let conn;

    try {
        conn = await dbPool.getConnection();
        await conn.query("UPDATE `staffog_web` SET `active`=0 WHERE `uuid`=?", [uuid]);

        let auditEntry: AuditUserDeactivated = {
            user: uuid,
            by: by,
            reason: reason
        }

        await addToAuditLog("user_deactivated", JSON.stringify(auditEntry));
    } catch (e) {
        console.log(e);
    } finally {
        if (conn) conn.release();
    }
}
import type { AppealEntry } from "$lib/types";
import { dbPool, getNameFromUUID } from "./global";

export async function getUnassignedAppeals(): Promise<Array<AppealEntry> | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_appeal` WHERE `assigned` IS NULL;");
        let toReturn = (result as Array<AppealEntry>);

        if (!toReturn) return null;

        for (let entry of toReturn) {
            let name = await getNameFromUUID(entry.uuid);
            if (name) entry.name = name;

            if (entry.assigned) {
                let assignedName = await getNameFromUUID(entry.assigned);
                if (assignedName) entry.assigned_name = assignedName;
            }
        }

        return toReturn;
    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }
}

export async function getPendingAppeals(): Promise<Array<AppealEntry> | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_appeal` WHERE `assigned` IS NOT NULL AND `open`=1;");
        let toReturn = (result as Array<AppealEntry>);

        if (!toReturn) return null;

        for (let entry of toReturn) {
            let name = await getNameFromUUID(entry.uuid);
            if (name) entry.name = name;

            if (entry.assigned) {
                let assignedName = await getNameFromUUID(entry.assigned);
                if (assignedName) entry.assigned_name = assignedName;
            }
        }

        return toReturn;
    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }
}    

export async function getAppealsAssignedTo(uuid: string): Promise<Array<AppealEntry> | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_appeal` WHERE `assigned`=?;", [uuid]);
        let toReturn = (result as Array<AppealEntry>);

        if (!toReturn) return null;

        for (let entry of toReturn) {
            let name = await getNameFromUUID(entry.uuid);
            if (name) entry.name = name;

            if (entry.assigned) {
                let assignedName = await getNameFromUUID(entry.assigned);
                if (assignedName) entry.assigned_name = assignedName;
            }
        }

        return toReturn;
    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }
}

export async function getAppealFromId(id: number): Promise<AppealEntry | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_appeal` WHERE `id`=?;", [id]);
        let entry = (result[0] as AppealEntry);

        if (!entry) return null;

        let name = await getNameFromUUID(entry.uuid);
        if (name) entry.name = name;

        if (entry.assigned) {
            let assignedName = await getNameFromUUID(entry.assigned);
            if (assignedName) entry.assigned_name = assignedName;
        }

        return entry;
    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }
}

export async function getClosedAppeals(): Promise<Array<AppealEntry> | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_appeal` WHERE `open`=0;");
        let toReturn = (result as Array<AppealEntry>);

        if (!toReturn) return null;

        for (let entry of toReturn) {
            let name = await getNameFromUUID(entry.uuid);
            if (name) entry.name = name;

            if (entry.assigned) {
                let assignedName = await getNameFromUUID(entry.assigned);
                if (assignedName) entry.assigned_name = assignedName;
            }
        }

        return toReturn;
    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }
}    
import type { ChatReportEntry, ChatReportMessage, ReportEntry } from "$lib/types";
import { dbPool, getNameFromUUID } from "./global";

export async function getUnassignedReports(): Promise<Array<ReportEntry> | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_report` WHERE `assigned` IS NULL;");
        let toReturn = (result as Array<ReportEntry>);

        if (!toReturn) return null;

        for (let entry of toReturn) {
            let name = await getNameFromUUID(entry.uuid);
            if (name) entry.name = name;

            let byName = await getNameFromUUID(entry.by_uuid);
            if (byName) entry.by_name = byName;

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

export async function isReportClaimed(id: number): Promise<boolean> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_report` WHERE `id`=? AND `assigned` IS NOT NULL;", [id]);
        let toReturn = (result as Array<ReportEntry>);

        if (!toReturn) return true;

        return toReturn.length != 0;
    } catch (e) {
        console.log(e);
        return true;
    } finally {
        if (conn) conn.release();
    }
}

export async function claimReport(id: number, uuid: string) {
    let conn;

    try {
        conn = await dbPool.getConnection();
        await conn.query("UPDATE `staffog_report` SET `assigned`=? WHERE `id`=?", [uuid, id]);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    } finally {
        if (conn) conn.release();
    }
}

export async function unclaimReport(id: number) {
    let conn;

    try {
        conn = await dbPool.getConnection();
        await conn.query("UPDATE `staffog_report` SET `assigned`=NULL WHERE `id`=?", [id]);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    } finally {
        if (conn) conn.release();
    }
}

export async function getPendingReports(): Promise<Array<ReportEntry> | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_report` WHERE `assigned` IS NOT NULL AND `open`=1;");
        let toReturn = (result as Array<ReportEntry>);

        if (!toReturn) return null;

        for (let entry of toReturn) {
            let name = await getNameFromUUID(entry.uuid);
            if (name) entry.name = name;

            let byName = await getNameFromUUID(entry.by_uuid);
            if (byName) entry.by_name = byName;

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

export async function getReportsAssignedTo(uuid: string): Promise<Array<ReportEntry> | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_report` WHERE `assigned`=? AND `open`=1;", [uuid]);
        let toReturn = (result as Array<ReportEntry>);

        if (!toReturn) return null;

        for (let entry of toReturn) {
            let name = await getNameFromUUID(entry.uuid);
            if (name) entry.name = name;

            let byName = await getNameFromUUID(entry.by_uuid);
            if (byName) entry.by_name = byName;

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

export async function getReportFromId(id: number): Promise<ReportEntry | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_report` WHERE `id`=?;", [id]);
        let entry = (result[0] as ReportEntry);

        if (!entry) return null;

        let name = await getNameFromUUID(entry.uuid);
        if (name) entry.name = name;

        let byName = await getNameFromUUID(entry.by_uuid);
        if (byName) entry.by_name = byName;

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

export async function closeReport(id: number, verdict: number, comment: string): Promise<boolean> {
    let conn;

    try {
        conn = await dbPool.getConnection();

        let currentTime = new Date().getTime();

        await conn.query("UPDATE `staffog_report` SET `open`=0, `verdict`=?, `verdict_time`=?, `comment`=? WHERE `id`=?", [verdict, currentTime, comment, id]);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    } finally {
        if (conn) conn.release();
    }
}

export async function getClosedReports(): Promise<Array<ReportEntry> | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_report` WHERE `open`=0 ORDER BY `id` DESC LIMIT 10;");
        let toReturn = (result as Array<ReportEntry>);

        if (!toReturn) return null;

        for (let entry of toReturn) {
            let name = await getNameFromUUID(entry.uuid);
            if (name) entry.name = name;

            let byName = await getNameFromUUID(entry.by_uuid);
            if (byName) entry.by_name = byName;

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

export async function getChatReportFromId(id: number): Promise<ChatReportEntry | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_chatreport` WHERE `id`=?;", [id]);
        let entry = (result[0] as ChatReportEntry);

        if (!entry) return null;

        let name = await getNameFromUUID(entry.uuid);
        if (name) entry.name = name;

        let byName = await getNameFromUUID(entry.by_uuid);
        if (byName) entry.by_name = byName;

        entry.processedMessages = JSON.parse(entry.messages) as Array<ChatReportMessage>

        return entry;
    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }
}
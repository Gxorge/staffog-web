import type { ChatReportEntry, ChatReportMessage, ReportEntry, ReportEvidence } from "$lib/types";
import { dbPool, getNameFromUUID } from "./global";

export async function getReport(uuid: String, id: number): Promise<ReportEntry | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let result = await conn.query("SELECT * FROM `staffog_report` WHERE `id`=? AND `by_uuid`=?;", [id, uuid]);
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

        entry.evidence = JSON.parse(result[0].evidence) as Array<ReportEvidence>;

        return entry;
    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }
}   

export async function submitReport(uuid: string, by_uuid: string, type: string, reason: string, evidence: Array<ReportEvidence>, crid: number | null): Promise<string | null> {
    let conn;

    try {
        conn = await dbPool.getConnection();
        let currentTime = new Date().getTime();

        const result = await conn.query("INSERT INTO `staffog_report` (`uuid`, `by_uuid`, `time`, `type`, `reason`, `evidence`, `crid`) VALUES (?, ?, ?, ?, ?, ?, ?)", [uuid, by_uuid, currentTime, type, conn.escape(reason), JSON.stringify(evidence), crid]);

        return result.insertId;
    } catch (e) {
        console.log(e);
        return null;
    } finally {
        if (conn) conn.release();
    }
}
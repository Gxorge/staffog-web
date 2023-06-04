export interface ReportEntry {
    id: number,
    uuid: string,
    name: string,
    by_uuid: string,
    by_name: string,
    time: bigint,
    type: string,
    crid: number | null,
    reason: string,
    evidence: Array<ReportEvidence>,
    open: number,
    assigned: string,
    assigned_name: string,
    verdict: number,
    verdict_time: bigint,
    comment: string
}

export interface ChatReportMessage {
    uuid: string,
    name: string,
    time: bigint,
    message: string
}

export interface ChatReportEntry {
    id: number,
    uuid: string,
    name: string,
    by_uuid: string,
    by_name: string,
    time: bigint,
    messages: string,
    processedMessages: Array<ChatReportMessage>
}

export interface ReportEvidence {
    type: String,
    data: String
}

export interface NewReportTask {
    id: number,
    offender: string,
    by: string,
    type: string
}
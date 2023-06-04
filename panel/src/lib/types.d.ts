export interface PunishEntry {
    id: bigint,
    uuid: string,
    name: string,
    reason: string,

    by_uuid: string,
    by_name: string,

    removed_uuid: string,
    removed_name: string,
    removed_reason: string,
    removed_time: bigint,

    time: bigint,
    until: bigint,
    active: number
}

export interface PunishStats {
    total: number,
    month: number,
    week: number,
    day: number
}

export interface PlayerPunishments {
    bans: Array<PunishEntry>
    mutes: Array<PunishEntry>
}

export interface OnlineStats {
    online: boolean,
    players: number,
    staff: number
}

export interface LoginResult {
    id: number,
    username: string,
    uuid: string,
    password: string,
    active: number,
    admin: number
}

export interface AuthResult {
    id: number,
    username: string,
    uuid: string,
    admin: number,
    ip: string
}

export interface SecurityCheckResult {
    allow: boolean,
    logout: boolean
}

export interface StaffIPInfo {
    id: number,
    uuid: string,
    ip: string,
    initial: boolean,
    panel_acknowledged: boolean,
    panel_verified: boolean,
    game_verified: boolean
}

export interface RevokePunishmentTask {
    type: string,
    id: number
}

export interface AppealEntry {
    id : number,
    uuid: string,
    name: string,
    time: bigint,
    type: string,
    pid: number,
    reason: string,
    open: boolean,
    assigned: string,
    assigned_name: string,
    verdict: number,
    verdict_time: bigint,
    comment: string
}

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

export interface ReportEvidence {
    type: String,
    data: String
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

export interface AuditPunishEditReason { // "punish_edit"
    type: string,
    id: number,
    user: string,
    oldReason: string,
    newReason: string
}

export interface AuditUserDeactivated { // "user_deactivated"
    user: string,
    by: string,
    reason: string
}
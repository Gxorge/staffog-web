export interface PunishEntry {
    id: bigint,
    type: string,
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

export interface PlayerPunishments {
    bans: Array<PunishEntry>
    mutes: Array<PunishEntry>
}

export interface AppealEntry {
    id: number,
    uuid: string,
    type: string,
    pid: number,
    reason: string,
    open: boolean,
    verdict: number,
    comment: string,
    punishment: PunishEntry
}

export interface NewAppealTask {
    id: number,
    by: string,
    type: string
}
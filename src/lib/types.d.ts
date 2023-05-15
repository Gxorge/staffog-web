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
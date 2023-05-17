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

export interface OnlineStats {
    online: boolean,
    players: number,
    staff: number
}

export interface PunishStats {
    total: number,
    month: number,
    week: number,
    day: number
}

export interface LoginResult {
    id: number,
    username: string,
    uuid: string,
    password: string,
    admin: number
}

export interface AuthResult {
    id: number,
    username: string,
    uuid: string,
    admin: number,
    ip: string
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
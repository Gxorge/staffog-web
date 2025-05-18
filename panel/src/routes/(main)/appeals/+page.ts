import { error } from '@sveltejs/kit';
import type {AppealEntry } from '$lib/types';

export const load = async ({ fetch, parent }) => {
    const { sessionUser } = await parent();

    const resUnassigned = await fetch("/backend/appeals/unassigned");
    let unassigned: Array<AppealEntry>;

    if (resUnassigned.status == 200) {
        unassigned = await resUnassigned.json();
    } else {
        error(500, "Server failed to get appeals.");
    }

    const resMy = await fetch("/backend/appeals/by/" + sessionUser.uuid);
    let my: Array<AppealEntry>;

    if (resMy.status == 200) {
        my = await resMy.json();
    } else {
        error(500, "Server failed to get appeals.");
    }

    const resPending = await fetch("/backend/appeals/pending");
    let pending: Array<AppealEntry>;

    if (resPending.status == 200) {
        pending = await resPending.json();
    } else {
        error(500, "Server failed to get appeals.");
    }

    const resClosed = await fetch("/backend/appeals/closed");
    let closed: Array<AppealEntry>;

    if (resClosed.status == 200) {
        closed = await resClosed.json();
    } else {
        error(500, "Server failed to get appeals.");
    }

    return {
        unassigned, my, pending, closed
    };
}
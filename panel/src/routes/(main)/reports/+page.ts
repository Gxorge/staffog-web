import { error } from '@sveltejs/kit';
import type { ReportEntry } from '$lib/types';

export const load = async ({ fetch, parent }) => {
    const { sessionUser } = await parent();

    const resUnassigned = await fetch("/backend/reports/unassigned");
    let unassigned: Array<ReportEntry>;

    if (resUnassigned.status == 200) {
        unassigned = await resUnassigned.json();
    } else {
        error(500, "Server failed to get reports.");
    }

    const resMy = await fetch("/backend/reports/by/" + sessionUser.uuid);
    let my: Array<ReportEntry>;

    if (resMy.status == 200) {
        my = await resMy.json();
    } else {
        error(500, "Server failed to get reports.");
    }

    const resPending = await fetch("/backend/reports/pending");
    let pending: Array<ReportEntry>;

    if (resPending.status == 200) {
        pending = await resPending.json();
    } else {
        error(500, "Server failed to get reports.");
    }

    const resClosed = await fetch("/backend/reports/closed");
    let closed: Array<ReportEntry>;

    if (resClosed.status == 200) {
        closed = await resClosed.json();
    } else {
        error(500, "Server failed to get reports.");
    }

    return {
        unassigned, my, pending, closed
    };
}
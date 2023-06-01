import { error } from '@sveltejs/kit';
import type { ReportEntry } from '$lib/types';

export const load = async ({ url, params, fetch }) => {

    let message = url.searchParams.get('message');

    const resReport = await fetch("/backend/reports/" + params.slug);
    let report: ReportEntry;

    if (resReport.status == 200) {
        report = await resReport.json();
    } else {
        throw error(404, "Report not found.")
    }

    return {
        report, message
    };
}
import { error } from '@sveltejs/kit';
import type { ChatReportEntry } from '$lib/types';

export const load = async ({ url, params, fetch }) => {

    let back = url.searchParams.get('back');

    if (!back) back = "/"

    const resReport = await fetch("/backend/reports/chatreport/" + params.slug);
    let report: ChatReportEntry;

    if (resReport.status == 200) {
        report = await resReport.json();
    } else {
        error(404, "Report not found.");
    }

    return {
        report, back
    };
}
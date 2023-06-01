import { isReportClaimed, unclaimReport } from '$lib/server/report.js';
import { apiCanAdminAccess } from '$lib/server/global';

export async function GET({ cookies, params }) {
    if (await apiCanAdminAccess(cookies.get('token')) == false) {
        return new Response("Unauthorized.", { status: 401 });
    }

    if (!Number(params.slug)) {
        return new Response("ID should be a number.", { status: 400 });
    }

    let appealId = Number(params.slug);

    if (await isReportClaimed(appealId) == false) {
        return new Response("Appeal is not claimed.", { status: 400 });
    }

    
    if (await unclaimReport(appealId) == false) {
        return new Response("Failed to unclaim appeal.", { status: 500 });
    }

    return new Response("OK", { status: 200});

}
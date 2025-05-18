import { checkInput, checkInputEvidence, getUUIDFromName, queueTask } from '$lib/server/global.js';
import { submitReport } from '$lib/server/report.js';
import { convertReportType } from '$lib/sharedfuncs.js';
import type { NewReportTask, ReportEvidence } from '$lib/types.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    submit: async (event) => {
        const data = await event.request.formData();
        let username = data.get("username");
        let offender = data.get("offender");
        let offence = data.get("offence");
        let crid: FormDataEntryValue | null | Number = data.get("crid");
        let reason = data.get("reason");
        let evidenceAmount = data.get("evlinkamt");
        let evidence: Array<ReportEvidence> = [];

        if (!username || !offender || !offence || !reason || !evidenceAmount) {
            return fail(500, { success: false, message: "Please complete the form." });
        }

        if (offence.toString() == "CHAT" && !crid) {
            return fail(500, { success: false, message: "Please complete the form." });
        }

        if (crid && !Number(crid)) {
            return fail(500, { success: false, message: "Chat Report ID must be a number." });
        }

        username = username.toString();
        offender = offender.toString();
        offence = offence.toString();
        crid = Number(crid);
        reason = reason.toString();

        for (let i = 0; i<Number(evidenceAmount); i++) {
            let eviType = data.get("evlink" + i + "-type");
            let eviData = data.get("evlink" + i + "-data");

            if (!eviType || !eviData) {
                let allowNoEvi = event.cookies.get("allowNoEvi");
                if (!allowNoEvi) {
                    event.cookies.set("allowNoEvi", "true", { 'path': '/' });
                    return fail(500, { success: false, message: "Please complete the evidence boxes. If you created too many boxes, please press submit again and the form will be accepted." });
                } else {
                    continue;
                }
            }

            if (!checkInputEvidence(eviType.toString()) || !checkInputEvidence(eviData.toString())) {
                return fail(500, { success: false, message: "Please check your evidence URLs, are they valid?" });
            }

            evidence.push({
                type: eviType.toString(),
                data: eviData.toString()
            });
        }

        if (!checkInput(username) || !checkInput(offender)) {
            return fail(500, { success: false, message: "Please check the usernames provided, are they valid?" });
        }



        let userUuid = await getUUIDFromName(username);
        let offenderUuid = await getUUIDFromName(offender);

        if (!userUuid) {
            return fail(500, { success: false, message: "Please check your username, have you ever joined the server?" });
        }

        if (!offenderUuid) {
            return fail(500, { success: false, message: "Please check the offender's username, have they ever joined the server?" });
        }

        event.cookies.delete("allowNoEvi", { 'path': '/' });
        let code = await submitReport(offenderUuid, userUuid, offence, reason, evidence, (!crid ? null : Number(crid)));
        if (!code) {
            return fail(500, { success: false, message: "Server failed to submit report, please try again later." });
        }

        let taskDetails: NewReportTask = {
            id: Number(code),
            by: username,
            offender: offender,
            type: convertReportType(offence)
        };
        await queueTask("newreport", JSON.stringify(taskDetails));

        redirect(303, "/done?ref=" + code);
    },
}
import { checkInput, getUUIDFromName, submitAppeal } from '$lib/server/global.js';
import { getActivePunishments } from '$lib/server/punish.js';
import type { PunishEntry } from '$lib/types.js';
import { fail, redirect } from '@sveltejs/kit';

let punishments: Array<PunishEntry> | null;
let selectedPunishment: PunishEntry | null;
export const actions = {
    stage_one: async (event) => {
        const data = await event.request.formData();
        let username = data.get('username');

        if (!username) {
            return fail(400, { stage: 1, success: false, message: "Please enter your username." });
        }

        username = username.toString();

        if (!checkInput(username)) {
            return fail(400, { stage: 1, success: false, message: "Please enter a valid username." });
        }

        let uuid = await getUUIDFromName(username);
        if (!uuid) {
            return fail(400, { stage: 1, success: false, message: "Please check your username, have you ever joined the server?" });
        }

        punishments = await getActivePunishments(uuid);
        if (!punishments || punishments.length == 0) {
            return fail(400, { stage: 1, success: false, message: "You do not have any active or appealable punishments." });
        }

        return { stage: 2, success: true, punishments: punishments }
    },

    stage_two: async (event) => {
        const data = await event.request.formData();
        let selectedForm = data.get('punishment');
        
        if (!selectedForm) {
            return fail(400, { stage: 2, success: false, message: "Please select a punishment", punishments: punishments });
        }

        if (!punishments) {
            return fail(500, { stage: 1, success: false, message: "Server failed (code 1), please try again." });
        }

        selectedForm = selectedForm.toString();

        selectedPunishment = null;
        for (let entry of punishments) {
            let generated = entry.type + " for " + entry.reason;
            if (generated == selectedForm) {
                selectedPunishment = entry;
                break;
            }
        }

        if (!selectedPunishment) {
            return fail(400, { stage: 2, success: false, message: "Please select a punishment", punishments: punishments });
        }

        return { stage: 3, success: true, punishment: selectedPunishment };
    },

    stage_three: async (event) => {
        const data = await event.request.formData();
        let reason = data.get('reason');

        if (!reason) {
            return fail(400, { stage: 3, success: false, message: "Please provide your reason.", punishment: selectedPunishment });
        }

        if (!selectedPunishment) {
            return fail(400, { stage: 2, success: false, message: "No punishment selected.", punishments: punishments });
        }

        let code = await submitAppeal(selectedPunishment.uuid, selectedPunishment.type, Number(selectedPunishment.id), reason.toString());
        if (!code) {
            return fail(400, { stage: 3, success: false, message: "Failed to submit appeal, please try again later.", punishment: selectedPunishment });
        }

        throw redirect(303, "/done?ref=" + code);
    },
}
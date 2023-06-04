import { checkInput, getNameFromUUID, getUUIDFromName, queueTask, submitAppeal } from '$lib/server/global.js';
import { getActivePunishments } from '$lib/server/punish.js';
import type { NewAppealTask, PunishEntry } from '$lib/types.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    stage_one: async (event) => {
        const data = await event.request.formData();
        let username = data.get('username');

        event.cookies.delete('punishments');
        event.cookies.delete('selected');

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

        let punishments = await getActivePunishments(uuid);
        if (!punishments || punishments.length == 0) {
            return fail(400, { stage: 1, success: false, message: "You do not have any active or appealable punishments." });
        }

        event.cookies.set('punishments', JSON.stringify(punishments, (key, value) => 
        typeof value === 'bigint'
            ? value.toString()
            : value))

        return { stage: 2, success: true, punishments: punishments }
    },

    stage_two: async (event) => {
        const data = await event.request.formData();
        let selectedForm = data.get('punishment');
        let punishmentsCookie = event.cookies.get('punishments');

        if (!punishmentsCookie) {
            return fail(500, { stage: 1, success: false, message: "Client failed (code 1), please try again." });
        }

        let punishments = JSON.parse(punishmentsCookie) as Array<PunishEntry>;
        if (selectedForm == null) {
            return fail(400, { stage: 2, success: false, message: "Please select a punishment.", punishments: punishments });
        }

        selectedForm = selectedForm.toString();

        let selectedPunishment = null;
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

        event.cookies.set('selected', JSON.stringify(selectedPunishment, (key, value) => 
        typeof value === 'bigint'
            ? value.toString()
            : value))

        return { stage: 3, success: true, punishment: selectedPunishment };
    },

    stage_three: async (event) => {
        const data = await event.request.formData();
        let reason = data.get('reason');
        let selectedCookie = event.cookies.get('selected');

        if (!selectedCookie) {
            return fail(500, { stage: 1, success: false, message: "Client failed (code 1), please try again." });
        }

        let selectedPunishment = JSON.parse(selectedCookie) as PunishEntry;
        if (!selectedPunishment) {
            return fail(500, { stage: 1, success: false, message: "Client failed (code 2), please try again." });
        }

        if (!reason) {
            return fail(400, { stage: 3, success: false, message: "Please provide your reason.", punishment: selectedPunishment });
        }

        let code = await submitAppeal(selectedPunishment.uuid, selectedPunishment.type, Number(selectedPunishment.id), reason.toString());
        if (!code) {
            return fail(400, { stage: 3, success: false, message: "Failed to submit appeal, please try again later.", punishment: selectedPunishment });
        }

        event.cookies.delete('punishments');
        event.cookies.delete('selected');

        let taskDetails: NewAppealTask = {
            id: Number(code),
            by: selectedPunishment.name,
            type: selectedPunishment.type
        };
        await queueTask("newappeal", JSON.stringify(taskDetails));

        throw redirect(303, "/done?ref=" + code);
    },
}
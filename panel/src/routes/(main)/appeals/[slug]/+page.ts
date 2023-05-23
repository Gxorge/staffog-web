import { error } from '@sveltejs/kit';
import type {AppealEntry, PunishEntry} from '$lib/types';

export const load = async ({ url, params, fetch }) => {

    let message = url.searchParams.get('message');

    const resAppeal = await fetch("/backend/appeals/" + params.slug);
    let appeal: AppealEntry;

    if (resAppeal.status == 200) {
        appeal = await resAppeal.json();
    } else {
        throw error(404, "Appeal not found.")
    }

    const resPunishment = await fetch("/backend/" + appeal.type.toLowerCase() + "s/" + appeal.pid);
    let punishment: PunishEntry;

    if (resPunishment.status == 200) {
        punishment = await resPunishment.json();
    } else {
        throw error(404, "Punishment not found.")
    }

    return {
        appeal, punishment, message
    };
}
import type { PageLoad } from './$types';

export const load = async ({ url }) => {

    let paramInGame = url.searchParams.get('ingame');

    return {
        paramInGame
    };
}
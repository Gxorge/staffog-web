import type { PageLoad } from './$types';

export const load = async ({ url }) => {

    let paramSuccess = url.searchParams.get('success');

    return {
        paramSuccess
    };
}
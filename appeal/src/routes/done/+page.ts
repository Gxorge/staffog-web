export const load = async ({ url }) => {

    let ref = url.searchParams.get('ref');

    return {
        ref
    };
}
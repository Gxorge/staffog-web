import { apiCanAccess} from '$lib/server/global';
import { getUserInfoByUuid } from '$lib/server/user.js';

export async function GET({ cookies, params }) {
    if (await apiCanAccess(cookies.get('token')) == false) {
        return new Response("Unauthorized.", { status: 401 });
    }

    let info = await getUserInfoByUuid(params.slug);

    return new Response((info ? "true" : "false"), { status: 200 });

}
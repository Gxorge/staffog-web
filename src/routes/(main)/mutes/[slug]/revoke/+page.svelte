<script lang="ts">
    import PunishRevoke from "$lib/PunishRevoke.svelte";
    import type { PageData, ActionData } from "./$types";

    export let data: PageData;
    export let form: ActionData;
</script>

<svelte:head>
	<title>Revoke Mute #{data.mute.id} | TrueOG</title>
</svelte:head>

<PunishRevoke form={form} entry={data.mute} type="Mute" serverOnline={data.online.online}/>
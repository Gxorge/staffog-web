<script lang="ts">
    import PunishRevoke from "$lib/PunishRevoke.svelte";
    import type { PageData, ActionData } from "./$types";

    export let data: PageData;
    export let form: ActionData;
</script>

<svelte:head>
	<title>Revoke Ban #{data.ban.id} | TrueOG</title>
</svelte:head>

<PunishRevoke form={form} entry={data.ban} type="Ban" serverOnline={data.online.online}/>
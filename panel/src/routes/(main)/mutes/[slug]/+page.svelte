<script lang="ts">
    import PunishView from "$lib/PunishView.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<svelte:head>
	<title>Mute #{data.mute.id} | TrueOG</title>
</svelte:head>

<PunishView paramResult={data.paramResult} entry={data.mute} type="Mute" admin={data.sessionUser.admin} back="/"/>
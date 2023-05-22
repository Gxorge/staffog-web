<script lang="ts">
    import PunishEdit from "$lib/PunishEdit.svelte";
    import type { PageData, ActionData } from "./$types";

    export let data: PageData;
    export let form: ActionData;
</script>

<svelte:head>
	<title>Edit Mute #{data.mute.id} | TrueOG</title>
</svelte:head>

<PunishEdit form={form} entry={data.mute} type="Mute"/>
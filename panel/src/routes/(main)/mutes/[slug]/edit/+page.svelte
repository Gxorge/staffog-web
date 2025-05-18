<script lang="ts">
    import PunishEdit from "$lib/PunishEdit.svelte";
    import type { PageData, ActionData } from "./$types";

    interface Props {
        data: PageData;
        form: ActionData;
    }

    let { data, form }: Props = $props();
</script>

<svelte:head>
	<title>Edit Mute #{data.mute.id} | TrueOG</title>
</svelte:head>

<PunishEdit form={form} entry={data.mute} type="Mute"/>
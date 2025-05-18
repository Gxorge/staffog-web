<script lang="ts">
    import PunishRevoke from "$lib/PunishRevoke.svelte";
    import type { PageData, ActionData } from "./$types";

    interface Props {
        data: PageData;
        form: ActionData;
    }

    let { data, form }: Props = $props();
</script>

<svelte:head>
	<title>Revoke Mute #{data.mute.id} | TrueOG</title>
</svelte:head>

<PunishRevoke form={form} entry={data.mute} type="Mute" serverOnline={data.online.online}/>
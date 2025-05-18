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
	<title>Revoke Ban #{data.ban.id} | TrueOG</title>
</svelte:head>

<PunishRevoke form={form} entry={data.ban} type="Ban" serverOnline={data.online.online}/>
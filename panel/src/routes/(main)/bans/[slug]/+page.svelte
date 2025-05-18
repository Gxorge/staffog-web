<script lang="ts">
    import PunishView from "$lib/PunishView.svelte";
    import type { PageData } from "./$types";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<svelte:head>
	<title>Ban #{data.ban.id} | TrueOG</title>
</svelte:head>

<PunishView paramResult={data.paramResult} entry={data.ban} type="Ban" admin={data.sessionUser.admin} back="/"/>
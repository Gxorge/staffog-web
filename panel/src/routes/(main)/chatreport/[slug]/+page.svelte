<script lang="ts">
    import ChatReportView from "$lib/ChatReportView.svelte";
    import type { PageData } from "./$types";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<svelte:head>
	<title>Chat Report #{data.report.id} | TrueOG</title>
</svelte:head>

<ChatReportView entry={data.report} back={data.back}/>
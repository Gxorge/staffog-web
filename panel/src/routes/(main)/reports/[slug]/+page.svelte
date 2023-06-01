<script lang="ts">
    import ReportView from "$lib/ReportView.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
    export let form: FormData;
</script>

<svelte:head>
	<title>Report #{data.report.id} | TrueOG</title>
</svelte:head>

<ReportView reportEntry={data.report} myUUID={data.sessionUser.uuid} isAdmin={data.sessionUser.admin} message={data.message} formData={form} back="/reports"/>
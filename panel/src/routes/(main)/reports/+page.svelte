<script lang="ts">
    import ReportTable from "$lib/ReportTable.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>
<svelte:head>
	<title>Reports | TrueOG</title>
</svelte:head>

<container class="container">
    <div class="content has-text-centered">
        <br>
        <h1>Player Reports</h1>
    </div>
    <div class="columns is-multiline">
        <div class="column staffog-gib-padding is-half">
            <br>
            <h1 class="title has-text-centered">Unassigned Reports</h1>
            <ReportTable entryList={data.unassigned} />
        </div>
        <div class="column staffog-gib-padding is-half">
            <br>
            <h1 class="title has-text-centered">Your Reports</h1>
            <ReportTable entryList={data.my} />
        </div>
        <div class="column staffog-gib-padding is-half">
            <br>
            <h1 class="title has-text-centered">Pending Reports</h1>
            <ReportTable entryList={data.pending} />
        </div>
        <div class="column staffog-gib-padding is-half">
            <br>
            <h1 class="title has-text-centered">Closed Reports</h1>
            <ReportTable entryList={data.closed} />
        </div>
    </div>
</container>
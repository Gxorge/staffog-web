<script lang="ts">
    import AppealTable from "$lib/AppealTable.svelte";
    import type { PageData } from "./$types";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>
<svelte:head>
	<title>Appeals | TrueOG</title>
</svelte:head>

<container class="container">
    <div class="content has-text-centered">
        <br>
        <h1>Punishment Appeals</h1>
    </div>
    <div class="columns is-multiline">
        <div class="column staffog-gib-padding is-half">
            <br>
            <h1 class="title has-text-centered">Unassigned Appeals</h1>
            <AppealTable entryList={data.unassigned} />
        </div>
        <div class="column staffog-gib-padding is-half">
            <br>
            <h1 class="title has-text-centered">Your Appeals</h1>
            <AppealTable entryList={data.my} />
        </div>
        <div class="column staffog-gib-padding is-half">
            <br>
            <h1 class="title has-text-centered">Pending Appeals</h1>
            <AppealTable entryList={data.pending} />
        </div>
        <div class="column staffog-gib-padding is-half">
            <br>
            <h1 class="title has-text-centered">Closed Appeals</h1>
            <AppealTable entryList={data.closed} />
        </div>
    </div>
</container>
<script lang="ts">
    import type { PageData } from './$types';
    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<svelte:head>
	<title>Report Submitted | TrueOG</title>
</svelte:head>

<div class="content has-text-centered">
    <h2>Report Submitted</h2>
    <p>Thanks for your report! We have recieved it successfully and will review it as soon as possible. Your reference code is <b>{data.ref}</b>, you will need this to check the status of your report or if you need any further assistance.</p>
</div>
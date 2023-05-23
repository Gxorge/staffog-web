<script lang="ts">
    import AppealView from "$lib/AppealView.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<svelte:head>
	<title>Appeal #{data.appeal.id} | TrueOG</title>
</svelte:head>

<AppealView appealEntry={data.appeal} punishEntry={data.punishment} back="/appeals"/>
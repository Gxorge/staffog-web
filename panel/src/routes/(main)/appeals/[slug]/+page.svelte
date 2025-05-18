<script lang="ts">
    import AppealView from "$lib/AppealView.svelte";
    import type { PageData } from "./$types";

    interface Props {
        data: PageData;
        form: FormData;
    }

    let { data, form }: Props = $props();
</script>

<svelte:head>
	<title>Appeal #{data.appeal.id} | TrueOG</title>
</svelte:head>

<AppealView appealEntry={data.appeal} punishEntry={data.punishment} myUUID={data.sessionUser.uuid} message={data.message} formData={form} back="/appeals"/>
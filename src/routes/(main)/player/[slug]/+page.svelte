<script lang="ts">
    import type { PageData } from './$types';
    import PunishTable from '$lib/PunishTable.svelte';

    export let data: PageData;
</script>

<svelte:head>
	<title>{data.name}'s Punishment History | TrueOG</title>
</svelte:head>

<container class="container">
    <div class="content has-text-centered">
        <br>
        <h1>{data.name}'s Punishment History </h1>
        {#if data.isBanned}
            <span class="tag is-danger">Banned</span>
        {/if}
        {#if data.isMuted}
            <span class="tag is-danger">Muted</span>
        {/if}

        {#if data.punishments.bans.length == 0 && data.punishments.mutes.length == 0}
            <div class="notification is-success">{data.name} has not been punished.</div>
        {:else}
            <div class="columns">
                <div class="column staffog-gib-padding">
                    <h1 class="title has-text-centered">Bans</h1>
                    <PunishTable entryList={data.punishments.bans} punishType="bans"/>
                </div>
                <div class="column staffog-gib-padding">
                    <h1 class="title has-text-centered">Mutes</h1>
                    <PunishTable entryList={data.punishments.mutes} punishType="mutes"/>
                </div>
            </div>
        {/if}
    </div>
</container>

<style lang="scss">
    .columns {
        padding-top: 20px;
        padding-right: 12px;
    }

    .staffog-gib-padding {
        padding-top: 30px;
    }
</style>
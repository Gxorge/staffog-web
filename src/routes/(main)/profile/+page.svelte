<script lang="ts">
    import type { PageData } from './$types';
    import PunishTable from '$lib/PunishTable.svelte';

    export let data: PageData;

    let viewableBans = data.punishments.bans;
    if (viewableBans.length > 9) {
        viewableBans = viewableBans.slice(0, 9)
    }

    let viewableMutes = data.punishments.mutes;
    if (viewableMutes.length > 9) {
        viewableMutes = viewableMutes.slice(0, 9)
    }

</script>

<svelte:head>
	<title>Your Profile | TrueOG</title>
</svelte:head>

<container class="container">
    <div class="content has-text-centered">
        <br>
        <h1>{data.sessionUser.username}'s Profile</h1>
        <p>You have issued <b>{data.totalPunishments}</b> punishments: {data.punishments.bans.length} bans and {data.punishments.mutes.length} mutes.</p>
    </div>
    <div class="columns">
        <div class="column staffog-gib-padding">
            <h1 class="title has-text-centered">Your Recent Bans</h1>
            <PunishTable entryList={viewableBans} punishType="bans"/>
        </div>
        <div class="column staffog-gib-padding">
            <h1 class="title has-text-centered">Your Recent Mutes</h1>
            <PunishTable entryList={viewableMutes} punishType="mutes"/>
        </div>
    </div>
</container>
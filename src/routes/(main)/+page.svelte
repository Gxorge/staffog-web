<script lang="ts">
    import PunishTable from "$lib/PunishTable.svelte";
    import StatsLevel from "$lib/StatsLevel.svelte";
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<svelte:head>
	<title>Home | TrueOG</title>
</svelte:head>

<container class="container">
    <div class="columns is-multiline">
        <div class="column is-full content has-text-centered">
            <h1>TrueOG Staff Pannel</h1>
            <br><br>
            <StatsLevel onlineStats={data.onlineStats} punishStats={data.punishStats}/>
        </div>
        <div class="column is-full">
            <section class="section content">
                <h5>Player Lookup</h5>
                <div class="field has-addons">
                    <div class="control is-expanded">
                      <input class="input" type="text" placeholder="Enter a player name or UUID">
                    </div>
                    <div class="control">
                        <button class="button is-link">Search</button>
                    </div>
                </div>
            </section>
        </div>
        <div class="column staffog-gib-padding">
            <h1 class="title has-text-centered">Recent Bans</h1>
            <PunishTable entryList={data.recentBans}/>
        </div>
        <div class="column staffog-gib-padding">
            <h1 class="title has-text-centered">Recent Mutes</h1>
            <PunishTable entryList={data.recentMutes}/>
        </div>
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

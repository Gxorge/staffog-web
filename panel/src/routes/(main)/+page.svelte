<script lang="ts">
    import PunishTable from "$lib/PunishTable.svelte";
    import StatsLevel from "$lib/StatsLevel.svelte";
    import type { PageData } from './$types';

    export let data: PageData;

    let searchError = "";
    let searchInput = "";


    function redirect(loc: string) {
        window.location.href = loc;
    }

    async function search() {
        if (searchInput == "") {
            searchError = "Please enter a player name or UUID."
            return;
        }

        // Probably a uuid
        if (searchInput.includes('-')) {
            let staffRes = await fetch('/backend/player/isstaff/' + searchInput);
            let isStaff = await staffRes.text();
            if (isStaff == "true")
                redirect('/profile/' + searchInput);
            else
                redirect('/player/' + searchInput);

        // Probably a name    
        } else {
            let uuidRes = await fetch('/backend/player/uuid/' + searchInput);
            if (uuidRes.status != 200) {
                searchError = "Player does not exist.";
                return;
            }

            let uuid = await uuidRes.text();

            let staffRes = await fetch('/backend/player/isstaff/' + uuid);
            let isStaff = await staffRes.text();
            if (isStaff == "true")
                redirect('/profile/' + uuid);
            else
                redirect('/player/' + uuid);
        }
    }
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
                {#if searchError != ""}
                    <div class="notification is-danger">{searchError}</div>
                {/if}
                <div class="field has-addons">
                    <div class="control is-expanded">
                      <input bind:value={searchInput} class="input" type="text" placeholder="Enter a player name or UUID">
                    </div>
                    <div class="control">
                        <button on:click={search} class="button is-link">Search</button>
                    </div>
                </div>
            </section>
        </div>
        <div class="column staffog-gib-padding">
            <h1 class="title has-text-centered">Recent Bans</h1>
            <PunishTable entryList={data.recentBans} punishType="bans"/>
        </div>
        <div class="column staffog-gib-padding">
            <h1 class="title has-text-centered">Recent Mutes</h1>
            <PunishTable entryList={data.recentMutes} punishType="mutes"/>
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

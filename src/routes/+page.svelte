<script lang="ts">
    import PunishTable from "$lib/PunishTable.svelte";
    import SideNav from "$lib/SideNav.svelte";
</script>

<svelte:head>
	<title>Home | TrueOG</title>
</svelte:head>

<container class="container">
    <div class="columns is-multiline">
        <SideNav/>
        <div class="column staffog-gib-padding">
            <h1 class="title has-text-centered">Recent Bans</h1>
            <PunishTable/>
        </div>
        <div class="column staffog-gib-padding">
            <h1 class="title has-text-centered">Recent Mutes</h1>
            <PunishTable/>
        </div>
    </div>
</container>

<style lang="scss">
    .columns {
        padding-right: 12px;
    }

    .staffog-gib-padding {
        padding-top: 30px;
    }
</style>

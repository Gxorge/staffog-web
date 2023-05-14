<script lang="ts">
    import "../app.scss";
    import SideNav from "$lib/SideNav.svelte";
</script>

<main>
    <div class="columns">
        <SideNav/>
        <div class="column">
            <slot/>
        </div>
    </div>
</main>
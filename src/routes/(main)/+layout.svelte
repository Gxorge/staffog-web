<script lang="ts">
    import "$lib/app.scss";
    import SideNav from "$lib/SideNav.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;
</script>

<main>
    <div class="columns">
        <SideNav userInfo={data.sessionUser} />
        <div class="column">
            <slot/>
        </div>
    </div>
</main>
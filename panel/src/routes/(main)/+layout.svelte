<script lang="ts">
    import "$lib/app.scss";
    import SideNav from "$lib/SideNav.svelte";
    import type { LayoutData } from "./$types";

    interface Props {
        data: LayoutData;
        children?: import('svelte').Snippet;
    }

    let { data, children }: Props = $props();
</script>

<main>
    <div class="columns">
        <SideNav userInfo={data.sessionUser} />
        <div class="column">
            {@render children?.()}
        </div>
    </div>
</main>
<script lang="ts">
    import "$lib/app.scss";
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<main>
    <container class="container box">
        <div class="content has-text-centered">
            <img src="/logo-alternate-transparent.png" alt="TrueOG logo." />
        </div>
        {@render children?.()}
    </container>    
</main>

<style lang="scss">
    img {
        width: 50%;
        height: auto;
    }
</style>
<script lang="ts">
    import { page } from '$app/stores';
    import "$lib/app.scss";
</script>

<section class="container box">
    <div class="content has-text-centered">
        <img src="/logo-alternate-transparent.png" alt="TrueOG logo." />
        <h2>Error {$page.status}</h2>
        <p>{$page.error.message}</p>
        <br><br>
        <p>If you believe this is a mistake, please get in touch with <b>admin@trueog.net</b>.</p>
    </div>
</section>

<style lang="scss">
    img {
        width: 50%;
        height: auto;
    }
</style>